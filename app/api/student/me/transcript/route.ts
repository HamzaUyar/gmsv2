import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { prisma } from "../../../../../lib/prisma";

export async function GET(request: NextRequest) {
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
    
    // Check if the user is a student
    if (user.role !== "STUDENT") {
      return NextResponse.json(
        { error: "Forbidden. Only students can access this endpoint." },
        { status: 403 }
      );
    }
    
    const userUbysId = user.ubysId;
    
    // First, try to get the transcript from our database
    const studentProfile = await prisma.studentProfile.findFirst({
      where: {
        user: {
          ubysId: userUbysId
        }
      },
      include: {
        transcripts: {
          where: {
            isActive: true
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      }
    });
    
    // If we have a transcript in our database, return it
    if (studentProfile?.transcripts.length) {
      const transcript = studentProfile.transcripts[0];
      
      return NextResponse.json({
        success: true,
        data: {
          transcript,
          isEligibleForGraduation: transcript.isEligibleForGraduation,
          source: "GMS Database"
        }
      });
    }
    
    // If no transcript in our database, fetch from UBYS API
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/mock/ubys/transcripts/${userUbysId}`);
    
    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch transcript from UBYS" },
        { status: 500 }
      );
    }
    
    const ubysTranscript = await response.json();
    
    // Determine eligibility based on GPA and credits
    // This is a simplified eligibility check - in a real system this would be more complex
    const isEligible = ubysTranscript.summary.cumulativeGpa >= 2.0 && 
                      ubysTranscript.summary.totalCreditsEarned >= 120;
    
    return NextResponse.json({
      success: true,
      data: {
        transcript: ubysTranscript,
        isEligibleForGraduation: isEligible,
        source: "UBYS API"
      }
    });
    
  } catch (error) {
    console.error("Error fetching transcript:", error);
    return NextResponse.json(
      { error: "Failed to fetch transcript" },
      { status: 500 }
    );
  }
} 