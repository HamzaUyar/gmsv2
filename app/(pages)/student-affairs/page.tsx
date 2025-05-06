"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { SessionUser, UserRole } from '../../types';
import { getStudents, getStudentTranscript, getDepartments, getFaculties } from '../../lib/api';

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
  const router = useRouter();
  
  // State for API data
  const [faculties, setFaculties] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [approvalStatus, setApprovalStatus] = useState("PENDING");
  const [facultyApprovalsCompleted, setFacultyApprovalsCompleted] = useState(false);
  const [documentsGenerated, setDocumentsGenerated] = useState(false);
  
  // New state for tracking data pull status
  const [dataStatus, setDataStatus] = useState({
    users: false,
    academicStructure: false,
    transcripts: false
  });

  // New state for documents
  const [documents, setDocuments] = useState<any[]>([]);

  // Check session status and redirect if needed
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/login');
    } else if (status === "authenticated") {
      const user = session.user as SessionUser;
      if (user?.role !== "STUDENT_AFFAIRS") {
        // If user is authenticated but doesn't have the correct role
        const rolePathMapping: {[key in UserRole]: string} = {
          STUDENT: "/student",
          ADVISOR: "/advisor",
          DEPARTMENT_SECRETARY: "/department",
          FACULTY_SECRETARY: "/faculty",
          STUDENT_AFFAIRS: "/student-affairs",
        };
        
        const correctPath = user?.role ? rolePathMapping[user.role] : "/";
        router.push(correctPath);
      }
    }
  }, [status, session, router]);

  // Load data from API
  useEffect(() => {
    async function loadData() {
      if (status === 'authenticated') {
        setLoading(true);
        try {
          // Get faculties
          const facultiesData = await getFaculties();
          
          // Enhance faculty data with approval status (mocked)
          const enhancedFaculties = facultiesData.map((fac: any, index: number) => {
            return {
              id: fac.ubysFacultyId,
              name: fac.name,
              totalStudents: 20 + (index * 5), // Mocked student count
              approvalStatus: index < 2 ? "APPROVED" : "PENDING",
              approvalDate: index < 2 ? `2023-05-${20 - index}` : null
            };
          });
          
          setFaculties(enhancedFaculties);
          
          // Check if all faculties have completed their approvals
          const allApproved = enhancedFaculties.every((fac: any) => fac.approvalStatus === "APPROVED");
          setFacultyApprovalsCompleted(allApproved);
          
          // Get all students
          const studentsData = await getStudents();
          
          // Enhance student data with transcripts and department/faculty info
          const enhancedStudents = await Promise.all(
            studentsData.map(async (student: any, index: number) => {
              try {
                const transcript = await getStudentTranscript(student.ubysId);
                const studentFaculty = facultiesData.find(
                  (fac: any) => fac.ubysFacultyId === student.additionalInfo.facultyUbysId
                );
                
                // Get departments to find the student's department
                const departments = await getDepartments(student.additionalInfo.facultyUbysId);
                const studentDept = departments.find(
                  (dept: any) => dept.ubysDepartmentId === student.additionalInfo.departmentUbysId
                );
                
                return {
                  id: student.ubysId,
                  name: `${student.firstName} ${student.lastName}`,
                  studentNo: student.additionalInfo.studentNo,
                  faculty: studentFaculty ? studentFaculty.name : 'Unknown',
                  department: studentDept ? studentDept.name : 'Unknown',
                  gpa: transcript?.summary?.cumulativeGpa || 0,
                  facultyRank: index % 3 + 1, // Mocked faculty rank
                  universityRank: index + 1 // Initial university rank
                };
              } catch (err) {
                console.error(`Error fetching data for student ${student.ubysId}:`, err);
                return {
                  id: student.ubysId,
                  name: `${student.firstName} ${student.lastName}`,
                  studentNo: student.additionalInfo.studentNo,
                  faculty: 'Unknown',
                  department: 'Unknown',
                  gpa: 0,
                  facultyRank: 0,
                  universityRank: index + 1
                };
              }
            })
          );
          
          // Sort by GPA for university ranking
          enhancedStudents.sort((a, b) => b.gpa - a.gpa);
          
          // Reassign university rank after sorting
          enhancedStudents.forEach((student, index) => {
            student.universityRank = index + 1;
          });
          
          setStudents(enhancedStudents);
          
          // Mock documents data based on top students
          const mockDocuments = enhancedStudents.slice(0, 3).flatMap(student => [
            { 
              id: `doc-diploma-${student.id}`, 
              studentName: student.name, 
              studentNo: student.studentNo, 
              type: "DIPLOMA", 
              documentNumber: `DIP-2023-${student.universityRank.toString().padStart(3, '0')}`, 
              generatedAt: "2023-05-22", 
              status: "PENDING" 
            },
            { 
              id: `doc-cert-${student.id}`, 
              studentName: student.name, 
              studentNo: student.studentNo, 
              type: "CERTIFICATE", 
              certificateType: student.universityRank === 1 ? "HIGH_HONOUR" : "HONOUR", 
              documentNumber: `CERT-2023-${student.universityRank.toString().padStart(3, '0')}`, 
              generatedAt: "2023-05-22", 
              status: "PENDING" 
            }
          ]);
          
        } catch (err) {
          setError('Failed to load data');
          console.error('Data loading error:', err);
        } finally {
          setLoading(false);
        }
      }
    }

    // Only load data if we have already pulled the data
    if (dataStatus.users && dataStatus.academicStructure && dataStatus.transcripts) {
      loadData();
    }
  }, [status, dataStatus]);

  // Function to pull user data
  const pullUserData = async () => {
    setLoading(true);
    try {
      // Make API calls to get user data
      const studentsData = await getStudents();
      const staffData = await fetch('/api/mock/ubys/users/staff').then(res => res.json());
      
      console.log(`Pulled data for ${studentsData.length} students and ${staffData.length} staff members`);
      
      // Mark user data as pulled
      setDataStatus(prev => ({...prev, users: true}));
      
      // Show success message
      setError(null);
    } catch (err) {
      setError('Failed to pull user data');
      console.error('User data pull error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to pull academic structure data
  const pullAcademicStructure = async () => {
    setLoading(true);
    try {
      // Make API calls to get academic structure data
      const facultiesData = await getFaculties();
      
      // Get all departments across all faculties
      let allDepartments: any[] = [];
      for (const faculty of facultiesData) {
        const facultyDepartments = await getDepartments(faculty.ubysFacultyId);
        allDepartments = [...allDepartments, ...facultyDepartments];
      }
      
      console.log(`Pulled data for ${facultiesData.length} faculties and ${allDepartments.length} departments`);
      
      // Mark academic structure as pulled
      setDataStatus(prev => ({...prev, academicStructure: true}));
      
      // Show success message
      setError(null);
    } catch (err) {
      setError('Failed to pull academic structure data');
      console.error('Academic structure pull error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to pull transcript data
  const pullTranscriptData = async () => {
    setLoading(true);
    try {
      // Get all students first
      const studentsData = await getStudents();
      
      // Filter for senior students (class level 4)
      const seniorStudents = studentsData.filter(
        (student: any) => student.additionalInfo.classLevel === 4
      );
      
      // Pull transcripts for all senior students
      const transcripts = await Promise.all(
        seniorStudents.map(async (student: any) => {
          try {
            return await getStudentTranscript(student.ubysId);
          } catch (err) {
            console.error(`Error fetching transcript for student ${student.ubysId}:`, err);
            return null;
          }
        })
      );
      
      const validTranscripts = transcripts.filter(t => t !== null);
      console.log(`Pulled ${validTranscripts.length} transcripts for ${seniorStudents.length} senior students`);
      
      // Mark transcripts as pulled
      setDataStatus(prev => ({...prev, transcripts: true}));
      
      // Show success message
      setError(null);
    } catch (err) {
      setError('Failed to pull transcript data');
      console.error('Transcript data pull error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to generate documents
  const generateDocuments = async () => {
    setLoading(true);
    try {
      if (!students || students.length === 0) {
        throw new Error("No student data available to generate documents");
      }
      
      // Sort students by GPA for proper ranking
      const rankedStudents = [...students].sort((a, b) => b.gpa - a.gpa);
      
      // Generate mock documents for eligible students
      const eligibleStudents = rankedStudents.filter(student => 
        student.gpa >= 2.0 // Basic eligibility criteria
      );
      
      // Generate diplomas and certificates
      const generatedDocuments = eligibleStudents.flatMap(student => {
        const documents = [];
        
        // Add diploma for all eligible students
        documents.push({
          id: `diploma-${student.id}`,
          studentName: student.name,
          studentNo: student.studentNo,
          type: "DIPLOMA",
          documentNumber: `DIP-2023-${student.universityRank.toString().padStart(3, '0')}`,
          generatedAt: new Date().toISOString().split('T')[0],
          status: "PENDING"
        });
        
        // Add honor certificate for high GPA students
        if (student.gpa >= 3.5) {
          documents.push({
            id: `cert-${student.id}`,
            studentName: student.name,
            studentNo: student.studentNo,
            type: "CERTIFICATE",
            certificateType: student.gpa >= 3.75 ? "HIGH_HONOUR" : "HONOUR",
            documentNumber: `CERT-2023-${student.universityRank.toString().padStart(3, '0')}`,
            generatedAt: new Date().toISOString().split('T')[0],
            status: "PENDING"
          });
        }
        
        return documents;
      });
      
      setDocuments(generatedDocuments);
      setDocumentsGenerated(true);
      setError(null);
      
      console.log(`Generated ${generatedDocuments.length} documents for ${eligibleStudents.length} students`);
    } catch (err) {
      setError('Failed to generate documents');
      console.error('Document generation error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to approve a document
  const approveDocument = (documentId: string) => {
    setDocuments(prevDocs => 
      prevDocs.map(doc => 
        doc.id === documentId ? { ...doc, status: "APPROVED" } : doc
      )
    );
  };
  
  // Function to download a document (mock function)
  const downloadDocument = (documentId: string) => {
    console.log(`Downloading document ${documentId}`);
    // In a real app, this would trigger a download
    alert(`Document ${documentId} would be downloaded in a real application`);
  };

  // Function to approve all transcripts
  const approveAllTranscripts = () => {
    setLoading(true);
    try {
      // Update approval status
      setApprovalStatus("APPROVED");
      
      // In a real application, this would make API calls to update the status in the database
      console.log("All transcripts approved at university level");
      
      setError(null);
    } catch (err) {
      setError('Failed to approve transcripts');
      console.error('Transcript approval error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to reject all transcripts
  const rejectAllTranscripts = () => {
    setLoading(true);
    try {
      // Update approval status
      setApprovalStatus("REJECTED");
      
      // In a real application, this would make API calls to update the status in the database
      console.log("All transcripts rejected at university level");
      
      setError(null);
    } catch (err) {
      setError('Failed to reject transcripts');
      console.error('Transcript rejection error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg font-semibold text-gray-600">Loading Dashboard...</div>
      </div>
    );
  }

  // Safety check - if no session or wrong role, show error
  if (!session?.user) {
    return (
      <div className="flex justify-center items-center h-64 flex-col">
        <div className="text-lg font-semibold text-red-600 mb-4">Session not available</div>
        <button 
          onClick={() => router.push('/login')}
          className="bg-[rgb(var(--primary))] hover:bg-opacity-85 text-white font-semibold py-2 px-5 rounded-lg"
        >
          Return to Login
        </button>
      </div>
    );
  }

  const user = session.user as SessionUser;
  
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
        colorStyle = "bg-[rgb(var(--primary))] hover:bg-opacity-85 text-white";
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
      <h1 className="text-3xl font-bold text-[rgb(var(--primary))]">Student Affairs Dashboard</h1>
      
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
                  ? 'border-[rgb(var(--primary))] text-[rgb(var(--primary))]'
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
              { 
                title: "User Data", 
                description: "Pull user data from UBYS including students, advisors, and secretaries.", 
                buttonText: "Pull User Data",
                action: pullUserData,
                isComplete: dataStatus.users
              },
              { 
                title: "Academic Structure", 
                description: "Pull faculty and department data from UBYS.", 
                buttonText: "Pull Academic Structure",
                action: pullAcademicStructure,
                isComplete: dataStatus.academicStructure
              },
              { 
                title: "Transcripts", 
                description: "Pull transcript data for senior students.", 
                buttonText: "Pull Transcript Data",
                action: pullTranscriptData,
                isComplete: dataStatus.transcripts
              }
            ].map(item => (
              <div key={item.title} className="bg-gray-50 p-6 rounded-lg border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <div className="flex items-center">
                    <h3 className="font-semibold text-lg text-gray-800 mb-1">{item.title}</h3>
                    {item.isComplete && (
                      <span className="ml-2 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                        Completed
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-3 sm:mb-0">{item.description}</p>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-4 flex-shrink-0">
                  {renderButton(
                    item.buttonText, 
                    item.action, 
                    item.isComplete ? 'secondary' : 'primary',
                    undefined,
                    false
                  )}
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
                    approvalStatus === "APPROVED" ? "bg-green-500" : 
                    approvalStatus === "REJECTED" ? "bg-red-500" : "bg-yellow-400"}`}></div>
                  <span className={`font-semibold text-lg ${
                    approvalStatus === "APPROVED" ? "text-green-600" : 
                    approvalStatus === "REJECTED" ? "text-red-600" : "text-yellow-500"}`}>
                    {approvalStatus === "APPROVED" ? "Approved" : approvalStatus === "REJECTED" ? "Rejected" : "Pending Review"}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center mb-4">
                <p className="text-base text-gray-600">All faculty approvals completed:</p>
                <span className={`font-semibold text-base px-3 py-1 rounded-full text-xs shadow-sm ${facultyApprovalsCompleted ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {facultyApprovalsCompleted ? "Yes" : "No"}
                </span>
              </div>
              {!facultyApprovalsCompleted && (
                <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-200">
                  Waiting for all faculties to complete their approvals before university approval can be finalized.
                </p>
              )}
              {facultyApprovalsCompleted && approvalStatus === "PENDING" && (
                <div className="mt-6 pt-4 border-t border-gray-200 flex space-x-3">
                  {renderButton("Approve All Transcripts", approveAllTranscripts, 'success', <CheckCircleIcon />)}
                  {renderButton("Reject All", rejectAllTranscripts, 'danger', <XCircleIcon />)}
                </div>
              )}
            </>
          )}
          {renderInfoCard(
            <>
              {renderSectionTitle("Faculty Status", <AcademicCapIcon />)}
              {renderTable(
                ["Faculty", "Total Students", "Status", "Approval Date", "Actions"],
                faculties.map((fac) => (
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
                students.map((student) => (
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
                  <div className={`w-4 h-4 rounded-full mr-2 ${documentsGenerated ? "bg-green-500" : "bg-yellow-400"}`}></div>
                  <span className={`font-semibold text-lg ${documentsGenerated ? "text-green-600" : "text-yellow-500"}`}>
                    {documentsGenerated ? "All Generated & Approved" : "Pending Generation / Approval"}
                  </span>
                </div>
              </div>
              <p className="text-base text-gray-600 mb-4">Status of diploma and certificate generation for all approved students.</p>
              {!documentsGenerated && facultyApprovalsCompleted && approvalStatus === "APPROVED" && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  {renderButton("Generate All Documents", generateDocuments, 'primary', <DocumentTextIcon />)}
                </div>
              )}
              {documentsGenerated && (
                <p className="text-sm text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
                  All necessary documents have been generated and approved.
                </p>
              )}
            </>
          )}
          {renderInfoCard(
            <>
              {renderSectionTitle("Generated Documents", <DocumentTextIcon />)}
              {documents.length > 0 ? (
                renderTable(
                  ["Student Name", "Student No", "Doc. Type", "Doc. No", "Generated At", "Status", "Actions"],
                  documents.map((doc) => (
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
                        {doc.status === "PENDING" && renderButton("Approve", () => approveDocument(doc.id), 'success', <CheckCircleIcon />)}
                        {renderButton("Download", () => downloadDocument(doc.id), 'secondary', <DownloadIcon />)}
                      </td>
                    </tr>
                  ))
                )
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {documentsGenerated ? "Loading documents..." : "No documents have been generated yet"}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
} 