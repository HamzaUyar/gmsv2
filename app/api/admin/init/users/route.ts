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
    
    // Fetch students from UBYS API
    const studentsResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/mock/ubys/users/students?classLevel=4`);
    if (!studentsResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch students from UBYS" },
        { status: 500 }
      );
    }
    const students = await studentsResponse.json();
    
    // Fetch staff from UBYS API
    const staffResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/mock/ubys/users/staff`);
    if (!staffResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch staff from UBYS" },
        { status: 500 }
      );
    }
    const staff = await staffResponse.json();
    
    // Combine all users
    const allUsers = [...students, ...staff];
    
    // Create users in our database
    const createdUsers = [];
    const updatedUsers = [];
    const errors = [];
    
    for (const ubysUser of allUsers) {
      try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
          where: { ubysId: ubysUser.ubysId }
        });
        
        if (existingUser) {
          // Update existing user
          const updatedUser = await prisma.user.update({
            where: { ubysId: ubysUser.ubysId },
            data: {
              email: ubysUser.email,
              firstName: ubysUser.firstName,
              lastName: ubysUser.lastName,
              role: ubysUser.role,
              isActive: true,
            }
          });
          updatedUsers.push(updatedUser);
        } else {
          // Create new user
          const newUser = await prisma.user.create({
            data: {
              ubysId: ubysUser.ubysId,
              email: ubysUser.email,
              firstName: ubysUser.firstName,
              lastName: ubysUser.lastName,
              role: ubysUser.role,
              isActive: true,
            }
          });
          
          // Create role-specific profile based on user role
          if (ubysUser.role === "STUDENT") {
            await prisma.studentProfile.create({
              data: {
                userId: newUser.id,
                studentNo: ubysUser.additionalInfo.studentNo,
                nationalId: ubysUser.additionalInfo.nationalId,
                birthDate: ubysUser.additionalInfo.birthDate ? new Date(ubysUser.additionalInfo.birthDate) : null,
                enrollmentDate: ubysUser.additionalInfo.enrollmentDate ? new Date(ubysUser.additionalInfo.enrollmentDate) : null,
                classLevel: ubysUser.additionalInfo.classLevel,
                departmentId: ubysUser.additionalInfo.departmentUbysId,
                facultyId: ubysUser.additionalInfo.facultyUbysId,
                advisorId: ubysUser.additionalInfo.advisorUbysId,
              }
            });
          } else if (ubysUser.role === "ADVISOR") {
            await prisma.advisorProfile.create({
              data: {
                userId: newUser.id,
                departmentId: ubysUser.additionalInfo.departmentUbysId,
                facultyId: ubysUser.additionalInfo.facultyUbysId,
              }
            });
          } else if (ubysUser.role === "DEPARTMENT_SECRETARY") {
            await prisma.departmentSecretaryProfile.create({
              data: {
                userId: newUser.id,
                departmentId: ubysUser.additionalInfo.departmentUbysId,
              }
            });
          } else if (ubysUser.role === "FACULTY_SECRETARY") {
            await prisma.facultySecretaryProfile.create({
              data: {
                userId: newUser.id,
                facultyId: ubysUser.additionalInfo.facultyUbysId,
              }
            });
          } else if (ubysUser.role === "STUDENT_AFFAIRS") {
            await prisma.studentAffairsProfile.create({
              data: {
                userId: newUser.id,
              }
            });
          }
          
          createdUsers.push(newUser);
        }
      } catch (error) {
        console.error(`Error processing user ${ubysUser.ubysId}:`, error);
        errors.push({
          ubysId: ubysUser.ubysId,
          error: error instanceof Error ? error.message : "Unknown error"
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      data: {
        created: createdUsers.length,
        updated: updatedUsers.length,
        errors: errors.length,
        errorDetails: errors
      }
    });
    
  } catch (error) {
    console.error("Error initializing users:", error);
    return NextResponse.json(
      { error: "Failed to initialize users" },
      { status: 500 }
    );
  }
} 