// Common types for the application

export type UserRole = 'STUDENT' | 'ADVISOR' | 'DEPARTMENT_SECRETARY' | 'FACULTY_SECRETARY' | 'STUDENT_AFFAIRS';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  ubysId: string;
  role: UserRole;
}

// Extended user type for session data
export interface SessionUser extends User {
  // Any additional fields that might be needed for the session
}

// Student specific types
export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  ubysId: string;
  role: 'STUDENT';
  gpa: number;
  totalCredits: number;
  facultyRank?: number;
  departmentRank?: number;
  universityRank?: number;
  isEligible?: boolean;
  status?: 'PENDING_ADVISOR_APPROVAL' | 'APPROVED' | 'REJECTED';
}

// Faculty types
export interface Faculty {
  id: string;
  name: string;
  totalStudents: number;
  approvalStatus: 'APPROVED' | 'PENDING' | 'REJECTED';
  approvalDate: string | null;
}

// Department types
export interface Department {
  id: string;
  name: string;
  totalStudents: number;
  approvalStatus: 'APPROVED' | 'PENDING' | 'REJECTED';
  approvalDate: string | null;
}

// Document types
export interface Document {
  id: string;
  studentName: string;
  studentNo: string;
  type: 'DIPLOMA' | 'CERTIFICATE';
  certificateType?: 'HIGH_HONOUR' | 'HONOUR';
  documentNumber: string;
  generatedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

// Approval status type
export type ApprovalStatus = 'APPROVED' | 'PENDING' | 'REJECTED'; 