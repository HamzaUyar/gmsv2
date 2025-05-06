import { NextRequest, NextResponse } from "next/server";
import { UserRole } from "../../../../../types";

// Mock staff data for demo purposes
const mockStaff = [
  // Advisors
  {
    ubysId: "ubys_adv_001",
    email: "advisor1@example.com",
    firstName: "Jane",
    lastName: "Advisor",
    role: "ADVISOR" as UserRole,
    additionalInfo: {
      departmentUbysId: "dept_001",
      facultyUbysId: "fac_001",
    }
  },
  {
    ubysId: "ubys_adv_002",
    email: "advisor2@example.com",
    firstName: "Mark",
    lastName: "Wilson",
    role: "ADVISOR" as UserRole,
    additionalInfo: {
      departmentUbysId: "dept_002",
      facultyUbysId: "fac_001",
    }
  },
  {
    ubysId: "ubys_adv_003",
    email: "advisor3@example.com",
    firstName: "Sarah",
    lastName: "Johnson",
    role: "ADVISOR" as UserRole,
    additionalInfo: {
      departmentUbysId: "dept_004",
      facultyUbysId: "fac_002",
    }
  },
  
  // Department Secretaries
  {
    ubysId: "ubys_dep_001",
    email: "depsec1@example.com",
    firstName: "David",
    lastName: "DepartmentSec",
    role: "DEPARTMENT_SECRETARY" as UserRole,
    additionalInfo: {
      departmentUbysId: "dept_001",
      facultyUbysId: "fac_001",
    }
  },
  {
    ubysId: "ubys_dep_002",
    email: "depsec2@example.com",
    firstName: "Emily",
    lastName: "Clark",
    role: "DEPARTMENT_SECRETARY" as UserRole,
    additionalInfo: {
      departmentUbysId: "dept_002",
      facultyUbysId: "fac_001",
    }
  },
  {
    ubysId: "ubys_dep_003",
    email: "depsec3@example.com",
    firstName: "Thomas",
    lastName: "Brown",
    role: "DEPARTMENT_SECRETARY" as UserRole,
    additionalInfo: {
      departmentUbysId: "dept_004",
      facultyUbysId: "fac_002",
    }
  },
  
  // Faculty Secretaries
  {
    ubysId: "ubys_fac_001",
    email: "facsec1@example.com",
    firstName: "Mary",
    lastName: "FacultySec",
    role: "FACULTY_SECRETARY" as UserRole,
    additionalInfo: {
      facultyUbysId: "fac_001",
    }
  },
  {
    ubysId: "ubys_fac_002",
    email: "facsec2@example.com",
    firstName: "James",
    lastName: "Taylor",
    role: "FACULTY_SECRETARY" as UserRole,
    additionalInfo: {
      facultyUbysId: "fac_002",
    }
  },
  {
    ubysId: "ubys_fac_003",
    email: "facsec3@example.com",
    firstName: "Patricia",
    lastName: "Miller",
    role: "FACULTY_SECRETARY" as UserRole,
    additionalInfo: {
      facultyUbysId: "fac_003",
    }
  },
  
  // Student Affairs Staff
  {
    ubysId: "ubys_aff_001",
    email: "affairs1@example.com",
    firstName: "Robert",
    lastName: "Affairs",
    role: "STUDENT_AFFAIRS" as UserRole,
    additionalInfo: {}
  },
  {
    ubysId: "ubys_aff_002",
    email: "affairs2@example.com",
    firstName: "Jennifer",
    lastName: "White",
    role: "STUDENT_AFFAIRS" as UserRole,
    additionalInfo: {}
  }
];

export async function GET(request: NextRequest) {
  // Get filters from query params if provided
  const searchParams = request.nextUrl.searchParams;
  const role = searchParams.get('role');
  const departmentUbysId = searchParams.get('departmentUbysId');
  const facultyUbysId = searchParams.get('facultyUbysId');
  
  // Simulate a delay to mimic real API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Apply filters
  let filteredStaff = [...mockStaff];
  
  if (role) {
    filteredStaff = filteredStaff.filter(
      (staff) => staff.role === role
    );
  }
  
  if (departmentUbysId) {
    filteredStaff = filteredStaff.filter(
      (staff) => staff.additionalInfo.departmentUbysId === departmentUbysId
    );
  }
  
  if (facultyUbysId) {
    filteredStaff = filteredStaff.filter(
      (staff) => staff.additionalInfo.facultyUbysId === facultyUbysId
    );
  }
  
  return NextResponse.json(filteredStaff, { status: 200 });
} 