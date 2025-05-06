import { NextRequest, NextResponse } from "next/server";

// Mock department data for demo purposes
const mockDepartments = [
  {
    ubysDepartmentId: "dept_001",
    name: "Computer Engineering",
    facultyUbysId: "fac_001",
  },
  {
    ubysDepartmentId: "dept_002",
    name: "Electrical Engineering",
    facultyUbysId: "fac_001",
  },
  {
    ubysDepartmentId: "dept_003",
    name: "Mechanical Engineering",
    facultyUbysId: "fac_001",
  },
  {
    ubysDepartmentId: "dept_004",
    name: "Business Administration",
    facultyUbysId: "fac_002",
  },
  {
    ubysDepartmentId: "dept_005",
    name: "Economics",
    facultyUbysId: "fac_002",
  },
  {
    ubysDepartmentId: "dept_006",
    name: "Medicine",
    facultyUbysId: "fac_003",
  },
  {
    ubysDepartmentId: "dept_007",
    name: "Pharmacy",
    facultyUbysId: "fac_003",
  },
  {
    ubysDepartmentId: "dept_008",
    name: "Law",
    facultyUbysId: "fac_004",
  },
  {
    ubysDepartmentId: "dept_009",
    name: "Physics",
    facultyUbysId: "fac_005",
  },
  {
    ubysDepartmentId: "dept_010",
    name: "Chemistry",
    facultyUbysId: "fac_005",
  },
  {
    ubysDepartmentId: "dept_011",
    name: "Biology",
    facultyUbysId: "fac_005",
  },
];

export async function GET(request: NextRequest) {
  // Get faculty filter from query params if provided
  const searchParams = request.nextUrl.searchParams;
  const facultyUbysId = searchParams.get('facultyUbysId');
  
  // Simulate a delay to mimic real API call
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Filter departments by faculty if specified
  if (facultyUbysId) {
    const filteredDepartments = mockDepartments.filter(
      (dept) => dept.facultyUbysId === facultyUbysId
    );
    return NextResponse.json(filteredDepartments, { status: 200 });
  }
  
  // Return all departments
  return NextResponse.json(mockDepartments, { status: 200 });
} 