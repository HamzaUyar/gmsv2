import { NextRequest, NextResponse } from "next/server";
import { UserRole } from "../../../../../types";

// Mock user database for demo purposes
const mockUsers = [
  {
    id: "user1",
    ubysId: "ubys_std_001",
    email: "student@example.com",
    firstName: "John",
    lastName: "Student",
    role: "STUDENT" as UserRole,
    isActive: true,
  },
  {
    id: "user2",
    ubysId: "ubys_adv_001",
    email: "advisor@example.com",
    firstName: "Jane",
    lastName: "Advisor",
    role: "ADVISOR" as UserRole,
    isActive: true,
  },
  {
    id: "user3",
    ubysId: "ubys_dep_001",
    email: "depsec@example.com",
    firstName: "David",
    lastName: "DepartmentSec",
    role: "DEPARTMENT_SECRETARY" as UserRole,
    isActive: true,
  },
  {
    id: "user4",
    ubysId: "ubys_fac_001",
    email: "facsec@example.com",
    firstName: "Mary",
    lastName: "FacultySec",
    role: "FACULTY_SECRETARY" as UserRole,
    isActive: true,
  },
  {
    id: "user5",
    ubysId: "ubys_aff_001",
    email: "affairs@example.com",
    firstName: "Robert",
    lastName: "Affairs",
    role: "STUDENT_AFFAIRS" as UserRole,
    isActive: true,
  },
];

export async function POST(request: NextRequest) {
  // Set appropriate CORS headers
  const headers = {
    'Content-Type': 'application/json',
  };
  
  try {
    const body = await request.json().catch(error => {
      console.error("Error parsing request body:", error);
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400, headers }
      );
    });
    
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: "Invalid request format" },
        { status: 400, headers }
      );
    }
    
    const { username } = body;

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400, headers }
      );
    }

    // Find user by UBYS ID (username)
    const user = mockUsers.find((u) => u.ubysId === username);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401, headers }
      );
    }

    // In a real application, we would check the password
    // For this demo, we just return the user if found
    return NextResponse.json(user, { status: 200, headers });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Authentication failed", message: (error as Error).message },
      { status: 500, headers }
    );
  }
} 