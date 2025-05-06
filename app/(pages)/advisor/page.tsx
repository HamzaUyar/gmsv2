"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { User, Student, ApprovalStatus } from "../../types";
import { getStudents, getStudentTranscript } from "../../lib/api";

// Placeholder icons - replace with actual icons
const UserIcon = () => <svg className="w-5 h-5 inline-block mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path></svg>;
const ListIcon = () => <svg className="w-5 h-5 inline-block mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>;
const EyeIcon = () => <svg className="w-4 h-4 inline-block mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path></svg>;
const CheckIcon = () => <svg className="w-4 h-4 inline-block mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>;

export default function AdvisorDashboard() {
  const { data: session, status } = useSession();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStudents() {
      const user = session?.user as User;
      if (user?.ubysId) {
        setLoading(true);
        try {
          // Fetch students assigned to this advisor
          const studentsData = await getStudents({ advisorUbysId: user.ubysId });
          
          // For each student, fetch their transcript to get GPA and credits
          const enhancedStudents = await Promise.all(
            studentsData.map(async (student: any) => {
              try {
                const transcript = await getStudentTranscript(student.ubysId);
                return {
                  id: student.ubysId,
                  firstName: student.firstName,
                  lastName: student.lastName,
                  email: student.email,
                  ubysId: student.ubysId,
                  role: student.role,
                  gpa: transcript?.summary?.cumulativeGpa || 0,
                  totalCredits: transcript?.summary?.totalCreditsEarned || 0,
                  isEligible: transcript?.summary?.graduationStatusUBYS === "Potentially Eligible",
                  status: "PENDING_ADVISOR_APPROVAL"
                };
              } catch (err) {
                console.error(`Error fetching transcript for student ${student.ubysId}:`, err);
                return {
                  id: student.ubysId,
                  firstName: student.firstName,
                  lastName: student.lastName,
                  email: student.email,
                  ubysId: student.ubysId,
                  role: student.role,
                  gpa: 0,
                  totalCredits: 0,
                  isEligible: false,
                  status: "PENDING_ADVISOR_APPROVAL"
                };
              }
            })
          );
          
          setStudents(enhancedStudents);
        } catch (err) {
          setError('Failed to load students');
          console.error('Students loading error:', err);
        } finally {
          setLoading(false);
        }
      }
    }

    if (status === 'authenticated') {
      loadStudents();
    }
  }, [session, status]);

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg font-semibold text-gray-600">Loading Dashboard...</div>
      </div>
    );
  }

  const user = session?.user as User;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-[rgb(var(--primary))]">Advisor Dashboard</h1>
      
      <Card>
        <h2 className="text-2xl font-semibold mb-6 text-gray-700 flex items-center">
          <UserIcon /> Your Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="text-lg font-medium text-gray-800">{user?.firstName} {user?.lastName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-lg font-medium text-gray-800">{user?.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">UBYS ID</p>
            <p className="text-lg font-medium text-gray-800">{user?.ubysId}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Role</p>
            <p className="text-lg font-medium text-gray-800">{user?.role}</p>
          </div>
        </div>
      </Card>
      
      <Card>
        <h2 className="text-2xl font-semibold mb-6 text-gray-700 flex items-center">
          <ListIcon /> Students Pending Approval
        </h2>
        {error && (
          <div className="text-red-500 mb-4">{error}</div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider border-b-2 border-gray-200">Name</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider border-b-2 border-gray-200">Student No</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider border-b-2 border-gray-200 text-center">GPA</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider border-b-2 border-gray-200 text-center">Credits</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider border-b-2 border-gray-200 text-center">Eligible</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider border-b-2 border-gray-200 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {students.length > 0 ? (
                students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-medium">{student.firstName} {student.lastName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{student.ubysId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-center">{typeof student.gpa === 'number' ? student.gpa.toFixed(2) : student.gpa}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-center">{student.totalCredits}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {student.isEligible ? (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                          Yes
                        </span>
                      ) : (
                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                          No
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 text-center">
                      <Button 
                        variant="outline" 
                        size="sm"
                        icon={<EyeIcon />}
                      >
                        View Transcript
                      </Button>
                      {student.isEligible && (
                        <Button 
                          variant="success" 
                          size="sm"
                          icon={<CheckIcon />}
                          className="mt-1 sm:mt-0"
                        >
                          Approve
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No students pending approval
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex space-x-4">
          <Button variant="outline" onClick={() => {}}>View All</Button>
          <Button 
            variant="primary" 
            onClick={() => {
              setLoading(true);
              const user = session?.user as User;
              if (user?.ubysId) {
                getStudents({ advisorUbysId: user.ubysId })
                  .then(async (studentsData) => {
                    const enhancedStudents = await Promise.all(
                      studentsData.map(async (student: any) => {
                        try {
                          const transcript = await getStudentTranscript(student.ubysId);
                          return {
                            id: student.ubysId,
                            firstName: student.firstName,
                            lastName: student.lastName,
                            email: student.email,
                            ubysId: student.ubysId,
                            role: student.role,
                            gpa: transcript?.summary?.cumulativeGpa || 0,
                            totalCredits: transcript?.summary?.totalCreditsEarned || 0,
                            isEligible: transcript?.summary?.graduationStatusUBYS === "Potentially Eligible",
                            status: "PENDING_ADVISOR_APPROVAL"
                          };
                        } catch (err) {
                          return {
                            id: student.ubysId,
                            firstName: student.firstName,
                            lastName: student.lastName,
                            email: student.email,
                            ubysId: student.ubysId,
                            role: student.role,
                            gpa: 0,
                            totalCredits: 0,
                            isEligible: false,
                            status: "PENDING_ADVISOR_APPROVAL"
                          };
                        }
                      })
                    );
                    setStudents(enhancedStudents);
                    setLoading(false);
                  })
                  .catch((err) => {
                    setError('Failed to refresh students');
                    console.error('Students refresh error:', err);
                    setLoading(false);
                  });
              }
            }}
          >
            Refresh
          </Button>
        </div>
      </Card>
    </div>
  );
} 