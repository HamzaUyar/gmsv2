"use client";

import React from 'react';
import { useSession } from 'next-auth/react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

// Placeholder icons
const UserIcon = () => <svg className="w-5 h-5 inline-block mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path></svg>;
const CheckCircleIcon = () => <svg className="w-5 h-5 inline-block mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>;
const XCircleIcon = () => <svg className="w-5 h-5 inline-block mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>;
const ListIcon = () => <svg className="w-5 h-5 inline-block mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>;
const EyeIcon = () => <svg className="w-4 h-4 inline-block mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path></svg>;

export default function DepartmentSecretaryDashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg font-semibold text-gray-600">Loading Dashboard...</div>
      </div>
    );
  }

  const user = session?.user as any;
  const mockDepartmentName = "Computer Engineering";
  const mockApprovalStatus: string = "PENDING";
  const mockAdvisorApprovalsCompleted = false;
  
  const mockStudents = [
    { id: "student1", name: "John Student", studentNo: "202011001", gpa: 3.65, advisorName: "Jane Advisor", approvalDate: "2023-05-15", departmentRank: 1 },
    { id: "student2", name: "Alice Smith", studentNo: "202011002", gpa: 3.42, advisorName: "Jane Advisor", approvalDate: "2023-05-14", departmentRank: 2 },
    { id: "student3", name: "Bob Johnson", studentNo: "202011003", gpa: 3.21, advisorName: "Mark Wilson", approvalDate: "2023-05-16", departmentRank: 3 },
  ];

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
            <p className="text-lg font-medium text-gray-800">{mockDepartmentName}</p>
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
              mockApprovalStatus === "APPROVED" ? "bg-green-500" : 
              mockApprovalStatus === "REJECTED" ? "bg-red-500" : "bg-yellow-400"
            }`}></div>
            <span className={`font-semibold text-lg ${
              mockApprovalStatus === "APPROVED" ? "text-green-600" : 
              mockApprovalStatus === "REJECTED" ? "text-red-600" : "text-yellow-500"
            }`}>
              {mockApprovalStatus === "APPROVED" ? "Approved" : 
               mockApprovalStatus === "REJECTED" ? "Rejected" : "Pending Review"}
            </span>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <p className="text-base text-gray-600">All advisor approvals completed:</p>
          <span className={`font-semibold text-base px-3 py-1 rounded-full text-xs shadow-sm ${mockAdvisorApprovalsCompleted ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {mockAdvisorApprovalsCompleted ? "Yes" : "No"}
          </span>
        </div>
        
        {!mockAdvisorApprovalsCompleted && (
          <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-200">
            Waiting for all advisors to complete their approvals before department approval can be finalized.
          </p>
        )}
        
        {mockAdvisorApprovalsCompleted && mockApprovalStatus === "PENDING" && (
          <div className="mt-6 pt-4 border-t border-gray-200 flex space-x-3">
            <Button variant="success" size="md" onClick={() => {}} icon={<CheckCircleIcon />}>Approve All</Button>
            <Button variant="danger" size="md" onClick={() => {}} icon={<XCircleIcon />}>Reject All</Button>
          </div>
        )}
      </Card>
      
      <Card>
        <h2 className="text-2xl font-semibold mb-6 text-gray-700 flex items-center"><ListIcon /> Students Approved by Advisors</h2>
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
              {mockStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-center font-medium">{student.departmentRank}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-medium">{student.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{student.studentNo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-center">{student.gpa.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{student.advisorName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{student.approvalDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <Button variant="outline" size="md" onClick={() => {}} icon={<EyeIcon />}>View Details</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
} 