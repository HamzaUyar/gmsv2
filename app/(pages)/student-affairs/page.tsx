"use client";

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';

// Placeholder icons - replace with actual icons from a library like react-icons
const UserIcon = () => <svg className="w-5 h-5 inline-block mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path></svg>;
const DatabaseIcon = () => <svg className="w-5 h-5 inline-block mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3zM3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7zM17 5c0-1.657-3.134-3-7-3S3 3.343 3 5v.017C5.104 5.55 7.421 6 10 6s4.896-.45 6.983-.983L17 5z"></path></svg>;
const AcademicCapIcon = () => <svg className="w-5 h-5 inline-block mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.998.998 0 01.056.941l-1.003 4.001a1 1 0 00.919 1.293H9.5a1 1 0 00.999-1V11.5a1 1 0 00-1-1H2.69l2.002-7.001L10 2.899l5.308 2.251L17.31 11H11.5a1 1 0 00-1 1v2.5a1 1 0 00.999 1h4.238a1 1 0 00.919-1.293l-1.003-4.001a.998.998 0 01.056-.941L19.006 6.921a1 1 0 000-1.84l-7-3a1.002 1.002 0 00-1.612 0zM10 12.25a.75.75 0 00.75.75h.002a.75.75 0 00.75-.75V11.5a.75.75 0 00-.75-.75h-.002a.75.75 0 00-.75.75v.75z"></path></svg>;
const DocumentTextIcon = () => <svg className="w-5 h-5 inline-block mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"></path></svg>;
const CheckCircleIcon = () => <svg className="w-5 h-5 inline-block mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>;
const XCircleIcon = () => <svg className="w-5 h-5 inline-block mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>;
const EyeIcon = () => <svg className="w-4 h-4 inline-block mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path></svg>;
const DownloadIcon = () => <svg className="w-4 h-4 inline-block mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>;


export default function StudentAffairsDashboard() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<'data' | 'transcripts' | 'documents'>('data');

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg font-semibold text-gray-600">Loading Dashboard...</div>
      </div>
    );
  }

  const user = session?.user as any;
  const mockApprovalStatus: string = "PENDING";
  const mockFacultyApprovalsCompleted = false;
  const mockDocumentsGenerated = false;
  
  const mockFaculties = [
    { id: "fac1", name: "Engineering Faculty", totalStudents: 30, approvalStatus: "APPROVED", approvalDate: "2023-05-20" },
    { id: "fac2", name: "Business Faculty", totalStudents: 25, approvalStatus: "APPROVED", approvalDate: "2023-05-19" },
    { id: "fac3", name: "Medicine Faculty", totalStudents: 20, approvalStatus: "PENDING", approvalDate: null },
  ];
  
  const mockStudents = [
    { id: "student1", name: "John Student", studentNo: "202011001", gpa: 3.65, faculty: "Engineering Faculty", department: "Computer Engineering", facultyRank: 1, universityRank: 1 },
    { id: "student2", name: "Alice Smith", studentNo: "202011002", gpa: 3.42, faculty: "Engineering Faculty", department: "Computer Engineering", facultyRank: 3, universityRank: 5 },
    { id: "student3", name: "Bob Johnson", studentNo: "202011003", gpa: 3.55, faculty: "Business Faculty", department: "Business Administration", facultyRank: 1, universityRank: 2 },
  ];
  
  const mockDocuments = [
    { id: "doc1", studentName: "John Student", studentNo: "202011001", type: "DIPLOMA", documentNumber: "DIP-2023-001", generatedAt: "2023-05-22", status: "PENDING" },
    { id: "doc2", studentName: "John Student", studentNo: "202011001", type: "CERTIFICATE", certificateType: "HIGH_HONOUR", documentNumber: "CERT-2023-001", generatedAt: "2023-05-22", status: "PENDING" },
    { id: "doc3", studentName: "Alice Smith", studentNo: "202011002", type: "DIPLOMA", documentNumber: "DIP-2023-002", generatedAt: "2023-05-22", status: "PENDING" },
  ];

  const renderSectionTitle = (title: string, icon?: React.ReactNode) => (
    <h2 className="text-2xl font-semibold mb-6 text-gray-700 flex items-center">
      {icon} {title}
    </h2>
  );

  const renderInfoCard = (children: React.ReactNode) => (
    <div className="bg-white rounded-xl shadow-xl p-8 mb-8">
      {children}
    </div>
  );

  const renderTable = (headers: string[], children: React.ReactNode) => (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header, idx) => (
              <th key={idx} className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider border-b-2 border-gray-200 whitespace-nowrap text-center">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {children}
        </tbody>
      </table>
    </div>
  );

  const renderButton = (text: string, onClick?: () => void, variant: 'primary' | 'secondary' | 'danger' | 'success' = 'primary', icon?: React.ReactNode, fullWidth = false) => {
    const baseStyle = `font-semibold py-2 px-5 rounded-lg text-base transition-colors shadow-md hover:shadow-lg flex items-center justify-center space-x-2 ${fullWidth ? 'w-full' : ''}`;
    let colorStyle = "";
    switch (variant) {
      case 'primary':
        colorStyle = "bg-[rgb(var(--iyte-red))] hover:bg-opacity-85 text-white";
        break;
      case 'secondary':
        colorStyle = "bg-gray-200 hover:bg-gray-300 text-gray-800";
        break;
      case 'danger':
        colorStyle = "bg-red-600 hover:bg-red-700 text-white";
        break;
      case 'success':
        colorStyle = "bg-green-600 hover:bg-green-700 text-white";
        break;
    }
    return <button onClick={onClick} className={`${baseStyle} ${colorStyle}`}>{icon}{text}</button>;
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-[rgb(var(--iyte-red))]">Student Affairs Dashboard</h1>
      
      {renderInfoCard(
        <>
          {renderSectionTitle("Your Information", <UserIcon />)}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div><p className="text-sm text-gray-500">Name</p><p className="text-lg font-medium text-gray-800">{user?.firstName} {user?.lastName}</p></div>
            <div><p className="text-sm text-gray-500">Email</p><p className="text-lg font-medium text-gray-800">{user?.email}</p></div>
            <div><p className="text-sm text-gray-500">UBYS ID</p><p className="text-lg font-medium text-gray-800">{user?.ubysId}</p></div>
            <div><p className="text-sm text-gray-500">Role</p><p className="text-lg font-medium text-gray-800">{user?.role}</p></div>
          </div>
        </>
      )}
      
      {/* Tabs */}
      <div className="mb-8 border-b border-gray-300">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          {[
            { name: 'System Data', tab: 'data', icon: <DatabaseIcon /> },
            { name: 'Transcript Approval', tab: 'transcripts', icon: <AcademicCapIcon /> },
            { name: 'Document Approval', tab: 'documents', icon: <DocumentTextIcon /> },
          ].map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.tab as any)}
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-semibold text-base flex items-center space-x-2 ${
                activeTab === item.tab
                  ? 'border-[rgb(var(--iyte-red))] text-[rgb(var(--iyte-red))]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {item.icon}<span>{item.name}</span>
            </button>
          ))}
        </nav>
      </div>
      
      {activeTab === 'data' && renderInfoCard(
        <>
          {renderSectionTitle("System Initialization", <DatabaseIcon />)}
          <div className="space-y-6">
            {[ 
              { title: "User Data", description: "Pull user data from UBYS including students, advisors, and secretaries.", buttonText: "Pull User Data" },
              { title: "Academic Structure", description: "Pull faculty and department data from UBYS.", buttonText: "Pull Academic Structure" },
              { title: "Transcripts", description: "Pull transcript data for senior students.", buttonText: "Pull Transcript Data" }
            ].map(item => (
              <div key={item.title} className="bg-gray-50 p-6 rounded-lg border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-1">{item.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 sm:mb-0">{item.description}</p>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-4 flex-shrink-0">
                  {renderButton(item.buttonText, () => {}, 'primary')}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      
      {activeTab === 'transcripts' && (
        <>
          {renderInfoCard(
            <>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 pb-4 border-b border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-700 mb-2 sm:mb-0">University Approval Status</h2>
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full mr-2 ${
                    mockApprovalStatus === "APPROVED" ? "bg-green-500" : 
                    mockApprovalStatus === "REJECTED" ? "bg-red-500" : "bg-yellow-400"}`}></div>
                  <span className={`font-semibold text-lg ${
                    mockApprovalStatus === "APPROVED" ? "text-green-600" : 
                    mockApprovalStatus === "REJECTED" ? "text-red-600" : "text-yellow-500"}`}>
                    {mockApprovalStatus === "APPROVED" ? "Approved" : mockApprovalStatus === "REJECTED" ? "Rejected" : "Pending Review"}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center mb-4">
                <p className="text-base text-gray-600">All faculty approvals completed:</p>
                <span className={`font-semibold text-base px-3 py-1 rounded-full text-xs shadow-sm ${mockFacultyApprovalsCompleted ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {mockFacultyApprovalsCompleted ? "Yes" : "No"}
                </span>
              </div>
              {!mockFacultyApprovalsCompleted && (
                <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-200">
                  Waiting for all faculties to complete their approvals before university approval can be finalized.
                </p>
              )}
              {mockFacultyApprovalsCompleted && mockApprovalStatus === "PENDING" && (
                <div className="mt-6 pt-4 border-t border-gray-200 flex space-x-3">
                  {renderButton("Approve All Transcripts", () => {}, 'success', <CheckCircleIcon />)}
                  {renderButton("Reject All", () => {}, 'danger', <XCircleIcon />)}
                </div>
              )}
            </>
          )}
          {renderInfoCard(
            <>
              {renderSectionTitle("Faculty Status", <AcademicCapIcon />)}
              {renderTable(
                ["Faculty", "Total Students", "Status", "Approval Date", "Actions"],
                mockFaculties.map((fac) => (
                  <tr key={fac.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-medium">{fac.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-center">{fac.totalStudents}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${ 
                          fac.approvalStatus === "APPROVED" ? "bg-green-100 text-green-700" : 
                          fac.approvalStatus === "REJECTED" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {fac.approvalStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-center">{fac.approvalDate || "N/A"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {renderButton("View Details", () => {}, 'primary', <EyeIcon />)}
                    </td>
                  </tr>
                ))
              )}
            </>
          )}
          {renderInfoCard(
            <>
              {renderSectionTitle("University Ranking of Students", <AcademicCapIcon />)}
              {renderTable(
                ["Uni. Rank", "Name", "Student No", "Faculty", "Dept.", "GPA", "Actions"],
                mockStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-center font-medium">{student.universityRank}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-medium">{student.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{student.studentNo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{student.faculty}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{student.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-center">{student.gpa.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {renderButton("View Full Details", () => {}, 'primary', <EyeIcon />)}
                    </td>
                  </tr>
                ))
              )}
            </>
          )}
        </>
      )}

      {activeTab === 'documents' && (
        <>
         {renderInfoCard(
            <>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 pb-4 border-b border-gray-200">
                 <h2 className="text-2xl font-semibold text-gray-700 mb-2 sm:mb-0">Document Generation & Approval</h2>
                 <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full mr-2 ${mockDocumentsGenerated ? "bg-green-500" : "bg-yellow-400"}`}></div>
                    <span className={`font-semibold text-lg ${mockDocumentsGenerated ? "text-green-600" : "text-yellow-500"}`}>
                        {mockDocumentsGenerated ? "All Generated & Approved" : "Pending Generation / Approval"}
                    </span>
                </div>
              </div>
              <p className="text-base text-gray-600 mb-4">Status of diploma and certificate generation for all approved students.</p>
              {!mockDocumentsGenerated && mockFacultyApprovalsCompleted && mockApprovalStatus === "APPROVED" && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                    {renderButton("Generate All Documents", () => {}, 'primary', <DocumentTextIcon />)}
                </div>
              )}
               {mockDocumentsGenerated && (
                <p className="text-sm text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
                  All necessary documents have been generated and approved.
                </p>
              )}
            </>
          )}
          {renderInfoCard(
            <>
              {renderSectionTitle("Generated Documents", <DocumentTextIcon />)}
              {renderTable(
                ["Student Name", "Student No", "Doc. Type", "Doc. No", "Generated At", "Status", "Actions"],
                mockDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-medium">{doc.studentName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{doc.studentNo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {doc.type === 'CERTIFICATE' ? `${doc.type} (${doc.certificateType})` : doc.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{doc.documentNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-center">{doc.generatedAt}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${ 
                          doc.status === "APPROVED" ? "bg-green-100 text-green-700" : 
                          doc.status === "REJECTED" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 text-center">
                      {renderButton("View", () => {}, 'primary', <EyeIcon />)}
                      {doc.status === "PENDING" && renderButton("Approve", () => {}, 'success', <CheckCircleIcon />)}
                      {renderButton("Download", () => {}, 'secondary', <DownloadIcon />)}
                    </td>
                  </tr>
                ))
              )}
            </>
          )}
        </>
    {
      id: "fac1",
      name: "Engineering Faculty",
      totalStudents: 30,
      approvalStatus: "APPROVED",
      approvalDate: "2023-05-20",
    },
    {
      id: "fac2",
      name: "Business Faculty",
      totalStudents: 25,
      approvalStatus: "APPROVED",
      approvalDate: "2023-05-19",
    },
    {
      id: "fac3",
      name: "Medicine Faculty",
      totalStudents: 20,
      approvalStatus: "PENDING",
      approvalDate: null,
    },
  ];
  
  // Mock student data for university level
  const mockStudents = [
    {
      id: "student1",
      name: "John Student",
      studentNo: "202011001",
      gpa: 3.65,
      faculty: "Engineering Faculty",
      department: "Computer Engineering",
      facultyRank: 1,
      universityRank: 1,
    },
    {
      id: "student2",
      name: "Alice Smith",
      studentNo: "202011002",
      gpa: 3.42,
      faculty: "Engineering Faculty",
      department: "Computer Engineering",
      facultyRank: 3,
      universityRank: 5,
    },
    {
      id: "student3",
      name: "Bob Johnson",
      studentNo: "202011003",
      gpa: 3.55,
      faculty: "Business Faculty",
      department: "Business Administration",
      facultyRank: 1,
      universityRank: 2,
    },
  ];
  
  // Mock document data
  const mockDocuments = [
    {
      id: "doc1",
      studentName: "John Student",
      studentNo: "202011001",
      type: "DIPLOMA",
      documentNumber: "DIP-2023-001",
      generatedAt: "2023-05-22",
      status: "PENDING",
    },
    {
      id: "doc2",
      studentName: "John Student",
      studentNo: "202011001",
      type: "CERTIFICATE",
      certificateType: "HIGH_HONOUR",
      documentNumber: "CERT-2023-001",
      generatedAt: "2023-05-22",
      status: "PENDING",
    },
    {
      id: "doc3",
      studentName: "Alice Smith",
      studentNo: "202011002",
      type: "DIPLOMA",
      documentNumber: "DIP-2023-002",
      generatedAt: "2023-05-22",
      status: "PENDING",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Student Affairs Dashboard</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Your Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Name</p>
            <p className="font-medium">{user?.firstName} {user?.lastName}</p>
          </div>
          <div>
            <p className="text-gray-600">Email</p>
            <p className="font-medium">{user?.email}</p>
          </div>
          <div>
            <p className="text-gray-600">UBYS ID</p>
            <p className="font-medium">{user?.ubysId}</p>
          </div>
          <div>
            <p className="text-gray-600">Role</p>
            <p className="font-medium">{user?.role}</p>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="mb-6">
        <div className="flex border-b">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'data' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('data')}
          >
            System Data
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'transcripts' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('transcripts')}
          >
            Transcript Approval
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'documents' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('documents')}
          >
            Document Approval
          </button>
        </div>
      </div>
      
      {/* System Data Tab */}
      {activeTab === 'data' && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">System Initialization</h2>
          
          <div className="space-y-4">
            <div className="p-4 border rounded-md">
              <h3 className="font-medium mb-2">User Data</h3>
              <p className="text-gray-600 mb-3">Pull user data from UBYS including students, advisors, and secretaries.</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                Pull User Data
              </button>
            </div>
            
            <div className="p-4 border rounded-md">
              <h3 className="font-medium mb-2">Academic Structure</h3>
              <p className="text-gray-600 mb-3">Pull faculty and department data from UBYS.</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                Pull Academic Structure
              </button>
            </div>
            
            <div className="p-4 border rounded-md">
              <h3 className="font-medium mb-2">Transcripts</h3>
              <p className="text-gray-600 mb-3">Pull transcript data for senior students.</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                Pull Transcript Data
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Transcript Approval Tab */}
      {activeTab === 'transcripts' && (
        <>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">University Approval Status</h2>
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${
                  mockApprovalStatus === "APPROVED" ? "bg-green-500" : 
                  mockApprovalStatus === "REJECTED" ? "bg-red-500" : "bg-yellow-500"
                }`}></div>
                <span className="font-medium">
                  {mockApprovalStatus === "APPROVED" ? "Approved" : 
                   mockApprovalStatus === "REJECTED" ? "Rejected" : "Pending"}
                </span>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-600">All faculty approvals completed:</p>
              <span className={`font-medium ${mockFacultyApprovalsCompleted ? "text-green-600" : "text-red-600"}`}>
                {mockFacultyApprovalsCompleted ? "Yes" : "No"}
              </span>
            </div>
            
            {!mockFacultyApprovalsCompleted && (
              <p className="text-sm text-gray-600 mb-4">
                Waiting for all faculties to complete their approvals before university approval can be finalized.
              </p>
            )}
            
            {mockFacultyApprovalsCompleted && mockApprovalStatus === "PENDING" && (
              <div className="mt-4">
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md mr-3">
                  Approve All Transcripts
                </button>
                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md">
                  Reject
                </button>
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Faculty Status</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3">Faculty</th>
                    <th className="px-6 py-3">Total Students</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Approval Date</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockFaculties.map((faculty) => (
                    <tr key={faculty.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4">{faculty.name}</td>
                      <td className="px-6 py-4">{faculty.totalStudents}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            faculty.approvalStatus === "APPROVED" ? "bg-green-500" : 
                            faculty.approvalStatus === "REJECTED" ? "bg-red-500" : "bg-yellow-500"
                          }`}></div>
                          <span>
                            {faculty.approvalStatus === "APPROVED" ? "Approved" : 
                             faculty.approvalStatus === "REJECTED" ? "Rejected" : "Pending"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">{faculty.approvalDate || "N/A"}</td>
                      <td className="px-6 py-4">
                        <button className="text-blue-600 hover:text-blue-800">
                          View Students
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">University Ranking of Students</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3">Univ. Rank</th>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Student No</th>
                    <th className="px-6 py-3">Faculty</th>
                    <th className="px-6 py-3">Department</th>
                    <th className="px-6 py-3">Faculty Rank</th>
                    <th className="px-6 py-3">GPA</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockStudents.map((student) => (
                    <tr key={student.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4">{student.universityRank}</td>
                      <td className="px-6 py-4">{student.name}</td>
                      <td className="px-6 py-4">{student.studentNo}</td>
                      <td className="px-6 py-4">{student.faculty}</td>
                      <td className="px-6 py-4">{student.department}</td>
                      <td className="px-6 py-4">{student.facultyRank}</td>
                      <td className="px-6 py-4">{student.gpa.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <button className="text-blue-600 hover:text-blue-800">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      
      {/* Document Approval Tab */}
      {activeTab === 'documents' && (
        <>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Document Generation Status</h2>
              <div>
                {mockApprovalStatus === "APPROVED" && !mockDocumentsGenerated && (
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                    Generate Documents
                  </button>
                )}
                {mockDocumentsGenerated && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Documents Generated
                  </span>
                )}
              </div>
            </div>
            
            <p className="text-gray-600 mb-4">
              {mockApprovalStatus !== "APPROVED" 
                ? "Transcript approval must be completed before documents can be generated."
                : mockDocumentsGenerated
                  ? "All documents have been generated and are ready for approval."
                  : "Transcripts have been approved. Documents can now be generated."
              }
            </p>
          </div>
          
          {mockDocumentsGenerated && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Documents Pending Approval</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3">Student</th>
                      <th className="px-6 py-3">Student No</th>
                      <th className="px-6 py-3">Document Type</th>
                      <th className="px-6 py-3">Document Number</th>
                      <th className="px-6 py-3">Generated At</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockDocuments.map((doc) => (
                      <tr key={doc.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4">{doc.studentName}</td>
                        <td className="px-6 py-4">{doc.studentNo}</td>
                        <td className="px-6 py-4">
                          {doc.type === "CERTIFICATE" 
                            ? `${doc.certificateType} Certificate` 
                            : "Diploma"}
                        </td>
                        <td className="px-6 py-4">{doc.documentNumber}</td>
                        <td className="px-6 py-4">{doc.generatedAt}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className={`w-2 h-2 rounded-full mr-2 ${
                              doc.status === "APPROVED" ? "bg-green-500" : 
                              doc.status === "REJECTED" ? "bg-red-500" : "bg-yellow-500"
                            }`}></div>
                            <span>
                              {doc.status === "APPROVED" ? "Approved" : 
                               doc.status === "REJECTED" ? "Rejected" : "Pending"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-blue-600 hover:text-blue-800 mr-2">
                            Preview
                          </button>
                          <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm">
                            Approve
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 