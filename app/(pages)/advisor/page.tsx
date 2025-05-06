"use client";

import React from 'react';
import { useSession } from 'next-auth/react';
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

// Placeholder icons - replace with actual icons
const UserIcon = () => <svg className="w-5 h-5 inline-block mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path></svg>;
const ListIcon = () => <svg className="w-5 h-5 inline-block mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>;
const EyeIcon = () => <svg className="w-4 h-4 inline-block mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path></svg>;
const CheckIcon = () => <svg className="w-4 h-4 inline-block mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>;


export default function AdvisorDashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg font-semibold text-gray-600">Loading Dashboard...</div>
      </div>
    );
  }

  const user = session?.user as any;

  const mockStudents = [
    { id: "student1", name: "John Student", studentNo: "202011001", gpa: 3.65, totalCredits: 136, isEligible: true, status: "PENDING_ADVISOR_APPROVAL" },
    { id: "student2", name: "Alice Smith", studentNo: "202011002", gpa: 3.42, totalCredits: 130, isEligible: true, status: "PENDING_ADVISOR_APPROVAL" },
    { id: "student3", name: "Bob Johnson", studentNo: "202011003", gpa: 2.85, totalCredits: 128, isEligible: false, status: "PENDING_ADVISOR_APPROVAL" },
  ];

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
              {mockStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-medium">{student.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{student.studentNo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-center">{student.gpa.toFixed(2)}</td>
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
                    <button className="text-[rgb(var(--iyte-red))] hover:text-opacity-80 font-semibold py-1 px-3 rounded-md hover:bg-red-50 transition-colors flex items-center justify-center mx-auto w-full sm:w-auto">
                      <EyeIcon /> View Transcript
                    </button>
                    {student.isEligible && (
                      <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-3 rounded-md text-sm transition-colors shadow-sm hover:shadow-md flex items-center justify-center mx-auto mt-1 sm:mt-0 w-full sm:w-auto">
                        <CheckIcon /> Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex space-x-4">
          <Button variant="outline" onClick={() => {}}>View All</Button>
          <Button variant="primary">Refresh</Button>
        </div>
      </Card>
    </div>
  );
} 