import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../auth/[...nextauth]/route";
import { prisma } from "../../../../../../lib/prisma";

// Define types locally to avoid importing from @prisma/client
type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";
type ApplicationStatus = 
  | "PENDING_ADVISOR_APPROVAL"
  | "PENDING_DEPARTMENT_SECRETARY_APPROVAL"
  | "PENDING_FACULTY_SECRETARY_APPROVAL"
  | "PENDING_STUDENT_AFFAIRS_TRANSCRIPT_APPROVAL"
  | "PENDING_STUDENT_AFFAIRS_DOCUMENT_APPROVAL"
  | "APPROVED_COMPLETED"
  | "REJECTED_ADVISOR"
  | "REJECTED_DEPARTMENT_SECRETARY"
  | "REJECTED_FACULTY_SECRETARY"
  | "REJECTED_STUDENT_AFFAIRS_TRANSCRIPT"
  | "REJECTED_STUDENT_AFFAIRS_DOCUMENT";

export async function POST(
  request: NextRequest,
  { params }: { params: { applicationId: string } }
) {
  try {
    const { applicationId } = params;
    
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
    
    // Check if the user is an advisor
    if (user.role !== "ADVISOR") {
      return NextResponse.json(
        { error: "Forbidden. Only advisors can approve applications." },
        { status: 403 }
      );
    }
    
    // Parse request body for notes
    const body = await request.json();
    const { notes } = body || {};
    
    // Get the advisor profile
    const advisorProfile = await prisma.advisorProfile.findFirst({
      where: {
        user: {
          ubysId: user.ubysId
        }
      }
    });
    
    if (!advisorProfile) {
      return NextResponse.json(
        { error: "Advisor profile not found" },
        { status: 404 }
      );
    }
    
    // Get the application
    const application = await prisma.graduationApplication.findUnique({
      where: { id: applicationId },
      include: {
        student: {
          include: {
            advisor: true
          }
        }
      }
    });
    
    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }
    
    // Check if the advisor is assigned to this student
    if (application.student.advisorId !== advisorProfile.id) {
      return NextResponse.json(
        { error: "You are not authorized to approve this student's application" },
        { status: 403 }
      );
    }
    
    // Check if the application is in the correct state
    if (application.status !== "PENDING_ADVISOR_APPROVAL") {
      return NextResponse.json(
        { error: `Cannot approve application in ${application.status} state` },
        { status: 400 }
      );
    }
    
    // Update the application
    const updatedApplication = await prisma.graduationApplication.update({
      where: { id: applicationId },
      data: {
        advisorApprovalStatus: "APPROVED" as ApprovalStatus,
        advisorApprovedById: advisorProfile.id,
        advisorApprovalDate: new Date(),
        advisorNotes: notes,
        status: "PENDING_DEPARTMENT_SECRETARY_APPROVAL" as ApplicationStatus,
      }
    });
    
    // Get the department for this application
    const department = await prisma.department.findFirst({
      where: {
        id: application.student.departmentId
      }
    });
    
    if (!department) {
      return NextResponse.json(
        { error: "Department not found" },
        { status: 500 }
      );
    }
    
    // Get or create department approval
    const currentYear = new Date().getFullYear();
    const approvalPeriodName = `${currentYear}-${currentYear + 1}`;
    
    let departmentApproval = await prisma.departmentGraduationApproval.findFirst({
      where: {
        departmentId: department.id,
        approvalPeriodName
      }
    });
    
    if (!departmentApproval) {
      departmentApproval = await prisma.departmentGraduationApproval.create({
        data: {
          departmentId: department.id,
          approvalPeriodName,
          status: "PENDING" as ApprovalStatus,
          allAdvisorApprovalsCompleted: false
        }
      });
    }
    
    // Link the application to the department approval
    await prisma.graduationApplication.update({
      where: { id: applicationId },
      data: {
        departmentApprovalId: departmentApproval.id
      }
    });
    
    // Calculate department rank
    // Get all approved applications for this department
    const approvedApplications = await prisma.graduationApplication.findMany({
      where: {
        student: {
          departmentId: department.id
        },
        advisorApprovalStatus: "APPROVED" as ApprovalStatus
      },
      include: {
        transcript: true
      },
      orderBy: {
        transcript: {
          gpa: 'desc'
        }
      }
    });
    
    // Update ranks for all applications
    for (let i = 0; i < approvedApplications.length; i++) {
      await prisma.graduationApplication.update({
        where: { id: approvedApplications[i].id },
        data: {
          departmentRank: i + 1
        }
      });
    }
    
    // Check if all advisor approvals are completed
    const totalSeniorStudentsInDepartment = await prisma.studentProfile.count({
      where: {
        departmentId: department.id,
        classLevel: 4
      }
    });
    
    const approvedStudentsCount = approvedApplications.length;
    
    if (approvedStudentsCount === totalSeniorStudentsInDepartment) {
      await prisma.departmentGraduationApproval.update({
        where: { id: departmentApproval.id },
        data: {
          allAdvisorApprovalsCompleted: true
        }
      });
    }
    
    return NextResponse.json({
      success: true,
      data: {
        application: updatedApplication,
        departmentRank: approvedApplications.findIndex((app: any) => app.id === applicationId) + 1
      }
    });
    
  } catch (error) {
    console.error("Error approving application:", error);
    return NextResponse.json(
      { error: "Failed to approve application" },
      { status: 500 }
    );
  }
} 