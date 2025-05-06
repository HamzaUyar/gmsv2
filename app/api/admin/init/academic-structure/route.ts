import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { prisma } from "../../../../../lib/prisma";

export async function POST(request: NextRequest) {
  try {
    // Get the current session
    const session = await getServerSession(authOptions);
    
    // Check if the user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Use type assertion for our custom user properties
    const user = session.user as any;
    
    // Check if the user is a student affairs staff
    if (user.role !== "STUDENT_AFFAIRS") {
      return NextResponse.json(
        { error: "Forbidden. Only Student Affairs staff can access this endpoint." },
        { status: 403 }
      );
    }
    
    // Fetch faculties from UBYS API
    const facultiesResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/mock/ubys/faculties`);
    if (!facultiesResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch faculties from UBYS" },
        { status: 500 }
      );
    }
    const faculties = await facultiesResponse.json();
    
    // Fetch departments from UBYS API
    const departmentsResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/mock/ubys/departments`);
    if (!departmentsResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch departments from UBYS" },
        { status: 500 }
      );
    }
    const departments = await departmentsResponse.json();
    
    // Create faculties and departments in our database
    const createdFaculties = [];
    const updatedFaculties = [];
    const createdDepartments = [];
    const updatedDepartments = [];
    const errors = [];
    
    // Process faculties first
    const facultyMap = new Map(); // To store ubysFacultyId -> id mapping
    
    for (const ubysFaculty of faculties) {
      try {
        // Check if faculty already exists
        const existingFaculty = await prisma.faculty.findUnique({
          where: { ubysFacultyId: ubysFaculty.ubysFacultyId }
        });
        
        if (existingFaculty) {
          // Update existing faculty
          const updatedFaculty = await prisma.faculty.update({
            where: { ubysFacultyId: ubysFaculty.ubysFacultyId },
            data: {
              name: ubysFaculty.name,
            }
          });
          updatedFaculties.push(updatedFaculty);
          facultyMap.set(ubysFaculty.ubysFacultyId, updatedFaculty.id);
        } else {
          // Create new faculty
          const newFaculty = await prisma.faculty.create({
            data: {
              ubysFacultyId: ubysFaculty.ubysFacultyId,
              name: ubysFaculty.name,
            }
          });
          createdFaculties.push(newFaculty);
          facultyMap.set(ubysFaculty.ubysFacultyId, newFaculty.id);
        }
      } catch (error) {
        console.error(`Error processing faculty ${ubysFaculty.ubysFacultyId}:`, error);
        errors.push({
          ubysFacultyId: ubysFaculty.ubysFacultyId,
          error: error instanceof Error ? error.message : "Unknown error"
        });
      }
    }
    
    // Process departments after faculties
    for (const ubysDepartment of departments) {
      try {
        // Get the faculty ID from our mapping
        const facultyId = facultyMap.get(ubysDepartment.facultyUbysId);
        
        if (!facultyId) {
          throw new Error(`Faculty with UBYS ID ${ubysDepartment.facultyUbysId} not found`);
        }
        
        // Check if department already exists
        const existingDepartment = await prisma.department.findUnique({
          where: { ubysDepartmentId: ubysDepartment.ubysDepartmentId }
        });
        
        if (existingDepartment) {
          // Update existing department
          const updatedDepartment = await prisma.department.update({
            where: { ubysDepartmentId: ubysDepartment.ubysDepartmentId },
            data: {
              name: ubysDepartment.name,
              facultyId: facultyId,
            }
          });
          updatedDepartments.push(updatedDepartment);
        } else {
          // Create new department
          const newDepartment = await prisma.department.create({
            data: {
              ubysDepartmentId: ubysDepartment.ubysDepartmentId,
              name: ubysDepartment.name,
              facultyId: facultyId,
            }
          });
          createdDepartments.push(newDepartment);
        }
      } catch (error) {
        console.error(`Error processing department ${ubysDepartment.ubysDepartmentId}:`, error);
        errors.push({
          ubysDepartmentId: ubysDepartment.ubysDepartmentId,
          error: error instanceof Error ? error.message : "Unknown error"
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      data: {
        faculties: {
          created: createdFaculties.length,
          updated: updatedFaculties.length,
        },
        departments: {
          created: createdDepartments.length,
          updated: updatedDepartments.length,
        },
        errors: errors.length,
        errorDetails: errors
      }
    });
    
  } catch (error) {
    console.error("Error initializing academic structure:", error);
    return NextResponse.json(
      { error: "Failed to initialize academic structure" },
      { status: 500 }
    );
  }
} 