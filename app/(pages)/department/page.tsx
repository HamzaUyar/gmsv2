"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { getStudents, getStudentTranscript, getDepartments, getStaff } from '../../lib/api';
import { User } from '../../types';

// Placeholder icons
const UserIcon = () => <svg className="w-5 h-5 inline-block mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path></svg>;
const CheckCircleIcon = () => <svg className="w-5 h-5 inline-block mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>;
const XCircleIcon = () => <svg className="w-5 h-5 inline-block mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>;
const ListIcon = () => <svg className="w-5 h-5 inline-block mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>;
const EyeIcon = () => <svg className="w-4 h-4 inline-block mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path></svg>;

export default function DepartmentSecretaryDashboard() {
  const { data: session, status } = useSession();
  const [departmentInfo, setDepartmentInfo] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [advisors, setAdvisors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [approvalStatus, setApprovalStatus] = useState("PENDING");
  const [advisorApprovalsCompleted, setAdvisorApprovalsCompleted] = useState(false);

  useEffect(() => {
    async function loadData() {
      const user = session?.user as User;
      if (user?.ubysId) {
        setLoading(true);
        try {
          // Get staff to find department information
          const staffData = await getStaff();
          const currentUser = staffData.find((staff: any) => staff.ubysId === user.ubysId);
          
          if (currentUser && currentUser.additionalInfo?.departmentUbysId) {
            // Get department information
            const departments = await getDepartments();
            const departmentData = departments.find(
              (dept: any) => dept.ubysDepartmentId === currentUser.additionalInfo.departmentUbysId
            );
            
            if (departmentData) {
              setDepartmentInfo(departmentData);
              
              // Get students from this department
              const departmentStudents = await getStudents({
                departmentUbysId: currentUser.additionalInfo.departmentUbysId
              });
              
              // Get staff to map advisors
              const advisorsList = staffData.filter(
                (staff: any) => staff.role === "ADVISOR" && 
                staff.additionalInfo?.departmentUbysId === currentUser.additionalInfo.departmentUbysId
              );
              setAdvisors(advisorsList);
              
              // Enhance student data with advisor info and transcripts
              const enhancedStudents = await Promise.all(
                departmentStudents.map(async (student: any, index: number) => {
                  try {
                    const transcript = await getStudentTranscript(student.ubysId);
                    const advisorInfo = advisorsList.find(
                      (advisor: any) => advisor.ubysId === student.additionalInfo.advisorUbysId
                    );
                    
                    return {
                      id: student.ubysId,
                      name: `${student.firstName} ${student.lastName}`,
                      studentNo: student.additionalInfo.studentNo,
                      gpa: transcript?.summary?.cumulativeGpa || 0,
                      advisorName: advisorInfo ? `${advisorInfo.firstName} ${advisorInfo.lastName}` : 'Unknown',
                      advisorUbysId: student.additionalInfo.advisorUbysId,
                      approvalDate: "2023-05-15", // Placeholder, would come from a real approval system
                      departmentRank: index + 1, // Simple rank based on array order
                    };
                  } catch (err) {
                    console.error(`Error fetching transcript for student ${student.ubysId}:`, err);
                    return {
                      id: student.ubysId,
                      name: `${student.firstName} ${student.lastName}`,
                      studentNo: student.additionalInfo.studentNo,
                      gpa: 0,
                      advisorName: 'Unknown',
                      advisorUbysId: student.additionalInfo.advisorUbysId,
                      approvalDate: "N/A",
                      departmentRank: index + 1,
                    };
                  }
                })
              );
              
              // Sort by GPA for department ranking
              enhancedStudents.sort((a, b) => b.gpa - a.gpa);
              
              // Reassign rank after sorting
              enhancedStudents.forEach((student, index) => {
                student.departmentRank = index + 1;
              });
              
              setStudents(enhancedStudents);
              
              // Check if all advisors have completed their approvals (mocked)
              setAdvisorApprovalsCompleted(enhancedStudents.length > 0);
            }
          }
        } catch (err) {
          setError('Failed to load department data');
          console.error('Department data loading error:', err);
        } finally {
          setLoading(false);
        }
      }
    }

    if (status === 'authenticated') {
      loadData();
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
      <h1 className="text-3xl font-bold text-[rgb(var(--primary))]">Department Secretary Dashboard</h1>
      
      <Card>
        <h2 className="text-2xl font-semibold mb-6 text-gray-700 flex items-center"><UserIcon /> Your Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="text-lg font-medium text-gray-800">{user?.firstName} {user?.lastName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-lg font-medium text-gray-800">{user?.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Department</p>
            <p className="text-lg font-medium text-gray-800">{departmentInfo?.name || "Loading..."}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Role</p>
            <p className="text-lg font-medium text-gray-800">{user?.role}</p>
          </div>
        </div>
      </Card>
      
      <Card>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 pb-4 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2 sm:mb-0">Department Approval Status</h2>
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-full mr-2 ${
              approvalStatus === "APPROVED" ? "bg-green-500" : 
              approvalStatus === "REJECTED" ? "bg-red-500" : "bg-yellow-400"
            }`}></div>
            <span className={`font-semibold text-lg ${
              approvalStatus === "APPROVED" ? "text-green-600" : 
              approvalStatus === "REJECTED" ? "text-red-600" : "text-yellow-500"
            }`}>
              {approvalStatus === "APPROVED" ? "Approved" : 
               approvalStatus === "REJECTED" ? "Rejected" : "Pending Review"}
            </span>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <p className="text-base text-gray-600">All advisor approvals completed:</p>
          <span className={`font-semibold text-base px-3 py-1 rounded-full text-xs shadow-sm ${advisorApprovalsCompleted ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {advisorApprovalsCompleted ? "Yes" : "No"}
          </span>
        </div>
        
        {!advisorApprovalsCompleted && (
          <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-200">
            Waiting for all advisors to complete their approvals before department approval can be finalized.
          </p>
        )}
        
        {advisorApprovalsCompleted && approvalStatus === "PENDING" && (
          <div className="mt-6 pt-4 border-t border-gray-200 flex space-x-3">
            <Button 
              variant="success" 
              size="md" 
              icon={<CheckCircleIcon />}
              onClick={() => setApprovalStatus("APPROVED")}
            >
              Approve All
            </Button>
            <Button 
              variant="danger" 
              size="md" 
              icon={<XCircleIcon />}
              onClick={() => setApprovalStatus("REJECTED")}
            >
              Reject All
            </Button>
          </div>
        )}
      </Card>
      
      <Card>
        <h2 className="text-2xl font-semibold mb-6 text-gray-700 flex items-center"><ListIcon /> Students Approved by Advisors</h2>
        {error && (
          <div className="text-red-500 mb-4">{error}</div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider border-b-2 border-gray-200 text-center">Rank</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider border-b-2 border-gray-200">Name</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider border-b-2 border-gray-200">Student No</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider border-b-2 border-gray-200 text-center">GPA</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider border-b-2 border-gray-200">Advisor</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider border-b-2 border-gray-200">Approval Date</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider border-b-2 border-gray-200 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {students.length > 0 ? (
                students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-center font-medium">{student.departmentRank}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-medium">{student.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{student.studentNo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-center">{typeof student.gpa === 'number' ? student.gpa.toFixed(2) : student.gpa}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{student.advisorName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{student.approvalDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <Button variant="outline" size="sm" icon={<EyeIcon />}>View Details</Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No students data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <Button 
            variant="primary" 
            onClick={() => {
              const user = session?.user as User;
              if (user?.ubysId) {
                setLoading(true);
                Promise.all([getStaff(), getDepartments()])
                  .then(([staffData, departments]) => {
                    const currentUser = staffData.find((staff: any) => staff.ubysId === user.ubysId);
                    if (currentUser && currentUser.additionalInfo?.departmentUbysId) {
                      const departmentData = departments.find(
                        (dept: any) => dept.ubysDepartmentId === currentUser.additionalInfo.departmentUbysId
                      );
                      if (departmentData) {
                        setDepartmentInfo(departmentData);
                        return getStudents({
                          departmentUbysId: currentUser.additionalInfo.departmentUbysId
                        }).then(departmentStudents => {
                          return { departmentStudents, staffData };
                        });
                      }
                    }
                    throw new Error("Could not find department information");
                  })
                  .then(({ departmentStudents, staffData }) => {
                    const advisorsList = staffData.filter(
                      (staff: any) => staff.role === "ADVISOR" && 
                      staff.additionalInfo?.departmentUbysId === departmentInfo.ubysDepartmentId
                    );
                    setAdvisors(advisorsList);
                    
                    return Promise.all(
                      departmentStudents.map(async (student: any, index: number) => {
                        try {
                          const transcript = await getStudentTranscript(student.ubysId);
                          const advisorInfo = advisorsList.find(
                            (advisor: any) => advisor.ubysId === student.additionalInfo.advisorUbysId
                          );
                          
                          return {
                            id: student.ubysId,
                            name: `${student.firstName} ${student.lastName}`,
                            studentNo: student.additionalInfo.studentNo,
                            gpa: transcript?.summary?.cumulativeGpa || 0,
                            advisorName: advisorInfo ? `${advisorInfo.firstName} ${advisorInfo.lastName}` : 'Unknown',
                            advisorUbysId: student.additionalInfo.advisorUbysId,
                            approvalDate: "2023-05-15", // Placeholder
                            departmentRank: index + 1,
                          };
                        } catch (err) {
                          return {
                            id: student.ubysId,
                            name: `${student.firstName} ${student.lastName}`,
                            studentNo: student.additionalInfo.studentNo,
                            gpa: 0,
                            advisorName: 'Unknown',
                            advisorUbysId: student.additionalInfo.advisorUbysId,
                            approvalDate: "N/A",
                            departmentRank: index + 1,
                          };
                        }
                      })
                    );
                  })
                  .then(enhancedStudents => {
                    // Sort by GPA
                    enhancedStudents.sort((a, b) => b.gpa - a.gpa);
                    
                    // Reassign rank after sorting
                    enhancedStudents.forEach((student, index) => {
                      student.departmentRank = index + 1;
                    });
                    
                    setStudents(enhancedStudents);
                    setAdvisorApprovalsCompleted(enhancedStudents.length > 0);
                    setLoading(false);
                  })
                  .catch(err => {
                    setError('Failed to refresh department data');
                    console.error('Department data refresh error:', err);
                    setLoading(false);
                  });
              }
            }}
          >
            Refresh Data
          </Button>
        </div>
      </Card>
    </div>
  );
} 