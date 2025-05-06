// Define enums directly instead of importing from Prisma client
export enum UserRole {
  STUDENT = "STUDENT",
  ADVISOR = "ADVISOR",
  DEPARTMENT_SECRETARY = "DEPARTMENT_SECRETARY",
  FACULTY_SECRETARY = "FACULTY_SECRETARY",
  STUDENT_AFFAIRS = "STUDENT_AFFAIRS"
}

export enum ApplicationStatus {
  PENDING_ADVISOR_APPROVAL = "PENDING_ADVISOR_APPROVAL",
  PENDING_DEPARTMENT_SECRETARY_APPROVAL = "PENDING_DEPARTMENT_SECRETARY_APPROVAL",
  PENDING_FACULTY_SECRETARY_APPROVAL = "PENDING_FACULTY_SECRETARY_APPROVAL",
  PENDING_STUDENT_AFFAIRS_TRANSCRIPT_APPROVAL = "PENDING_STUDENT_AFFAIRS_TRANSCRIPT_APPROVAL",
  PENDING_STUDENT_AFFAIRS_DOCUMENT_APPROVAL = "PENDING_STUDENT_AFFAIRS_DOCUMENT_APPROVAL",
  APPROVED_COMPLETED = "APPROVED_COMPLETED",
  REJECTED_ADVISOR = "REJECTED_ADVISOR",
  REJECTED_DEPARTMENT_SECRETARY = "REJECTED_DEPARTMENT_SECRETARY",
  REJECTED_FACULTY_SECRETARY = "REJECTED_FACULTY_SECRETARY",
  REJECTED_STUDENT_AFFAIRS_TRANSCRIPT = "REJECTED_STUDENT_AFFAIRS_TRANSCRIPT",
  REJECTED_STUDENT_AFFAIRS_DOCUMENT = "REJECTED_STUDENT_AFFAIRS_DOCUMENT"
}

export enum ApprovalStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED"
}

export enum CertificateType {
  HONOUR = "HONOUR",
  HIGH_HONOUR = "HIGH_HONOUR"
}

// Auth related types
export interface SessionUser {
  id: string;
  ubysId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: any;
}

// UBYS Mock API types
export interface UBYSUser {
  ubysId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  additionalInfo?: Record<string, any>;
}

export interface UBYSFaculty {
  ubysFacultyId: string;
  name: string;
}

export interface UBYSDepartment {
  ubysDepartmentId: string;
  name: string;
  facultyUbysId: string;
}

export interface UBYSTranscriptCourse {
  courseCode: string;
  courseName: string;
  credits: number;
  grade: string;
  numericGrade: number;
}

export interface UBYSTranscriptSemester {
  semesterCode: string;
  courses: UBYSTranscriptCourse[];
  semesterGpa: number;
}

export interface UBYSTranscript {
  studentInfo: {
    ubysId: string;
    studentNo: string;
    firstName: string;
    lastName: string;
    departmentName: string;
    facultyName: string;
  };
  semesters: UBYSTranscriptSemester[];
  summary: {
    cumulativeGpa: number;
    totalCreditsEarned: number;
    graduationStatusUBYS?: string;
  };
} 