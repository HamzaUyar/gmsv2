import { NextRequest, NextResponse } from "next/server";
import { UserRole } from "../../../../../types";

// Mock student data for demo purposes
const mockStudents = [
  {
    ubysId: "ubys_std_001",
    email: "student1@example.com",
    firstName: "John",
    lastName: "Student",
    role: "STUDENT" as UserRole,
    additionalInfo: {
      studentNo: "202011001",
      nationalId: "12345678901",
      birthDate: "2000-01-15",
      enrollmentDate: "2020-09-01",
      classLevel: 4,
      departmentUbysId: "dept_001",
      facultyUbysId: "fac_001",
      advisorUbysId: "ubys_adv_001"
    }
  },
  {
    ubysId: "ubys_std_002",
    email: "student2@example.com",
    firstName: "Alice",
    lastName: "Smith",
    role: "STUDENT" as UserRole,
    additionalInfo: {
      studentNo: "202011002",
      nationalId: "12345678902",
      birthDate: "2000-03-22",
      enrollmentDate: "2020-09-01",
      classLevel: 4,
      departmentUbysId: "dept_001",
      facultyUbysId: "fac_001",
      advisorUbysId: "ubys_adv_001"
    }
  },
  {
    ubysId: "ubys_std_003",
    email: "student3@example.com",
    firstName: "Bob",
    lastName: "Johnson",
    role: "STUDENT" as UserRole,
    additionalInfo: {
      studentNo: "202011003",
      nationalId: "12345678903",
      birthDate: "2000-05-10",
      enrollmentDate: "2020-09-01",
      classLevel: 4,
      departmentUbysId: "dept_001",
      facultyUbysId: "fac_001",
      advisorUbysId: "ubys_adv_001"
    }
  },
  {
    ubysId: "ubys_std_004",
    email: "student4@example.com",
    firstName: "Emma",
    lastName: "Wilson",
    role: "STUDENT" as UserRole,
    additionalInfo: {
      studentNo: "202011004",
      nationalId: "12345678904",
      birthDate: "2000-07-05",
      enrollmentDate: "2020-09-01",
      classLevel: 4,
      departmentUbysId: "dept_002",
      facultyUbysId: "fac_001",
      advisorUbysId: "ubys_adv_002"
    }
  },
  {
    ubysId: "ubys_std_005",
    email: "student5@example.com",
    firstName: "Michael",
    lastName: "Brown",
    role: "STUDENT" as UserRole,
    additionalInfo: {
      studentNo: "202011005",
      nationalId: "12345678905",
      birthDate: "2000-09-18",
      enrollmentDate: "2020-09-01",
      classLevel: 4,
      departmentUbysId: "dept_004",
      facultyUbysId: "fac_002",
      advisorUbysId: "ubys_adv_003"
    }
  }
];

export async function GET(request: NextRequest) {
  // Get filters from query params if provided
  const searchParams = request.nextUrl.searchParams;
  const departmentUbysId = searchParams.get('departmentUbysId');
  const facultyUbysId = searchParams.get('facultyUbysId');
  const advisorUbysId = searchParams.get('advisorUbysId');
  const classLevel = searchParams.get('classLevel');
  
  // Simulate a delay to mimic real API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Apply filters
  let filteredStudents = [...mockStudents];
  
  if (departmentUbysId) {
    filteredStudents = filteredStudents.filter(
      (student) => student.additionalInfo.departmentUbysId === departmentUbysId
    );
  }
  
  if (facultyUbysId) {
    filteredStudents = filteredStudents.filter(
      (student) => student.additionalInfo.facultyUbysId === facultyUbysId
    );
  }
  
  if (advisorUbysId) {
    filteredStudents = filteredStudents.filter(
      (student) => student.additionalInfo.advisorUbysId === advisorUbysId
    );
  }
  
  if (classLevel) {
    filteredStudents = filteredStudents.filter(
      (student) => student.additionalInfo.classLevel === parseInt(classLevel)
    );
  }
  
  return NextResponse.json(filteredStudents, { status: 200 });
} 