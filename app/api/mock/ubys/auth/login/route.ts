import { NextRequest, NextResponse } from "next/server";

// Define UserRole enum directly to avoid import issues
type UserRole = "STUDENT" | "ADVISOR" | "DEPARTMENT_SECRETARY" | "FACULTY_SECRETARY" | "STUDENT_AFFAIRS";

// Mock user database for demo purposes
const mockUsers = [
  // Students
  {
    id: "user1",
    ubysId: "ubys_std_001",
    email: "student1@example.com",
    firstName: "John",
    lastName: "Student",
    role: "STUDENT" as UserRole,
    isActive: true,
  },
  {
    id: "user2",
    ubysId: "ubys_std_002",
    email: "student2@example.com",
    firstName: "Alice",
    lastName: "Smith",
    role: "STUDENT" as UserRole,
    isActive: true,
  },
  {
    id: "user3",
    ubysId: "ubys_std_003",
    email: "student3@example.com",
    firstName: "Bob",
    lastName: "Johnson",
    role: "STUDENT" as UserRole,
    isActive: true,
  },
  {
    id: "user4",
    ubysId: "ubys_std_004",
    email: "student4@example.com",
    firstName: "Emma",
    lastName: "Wilson",
    role: "STUDENT" as UserRole,
    isActive: true,
  },
  {
    id: "user5",
    ubysId: "ubys_std_005",
    email: "student5@example.com",
    firstName: "Michael",
    lastName: "Brown",
    role: "STUDENT" as UserRole,
    isActive: true,
  },
  
  // Advisors
  {
    id: "user6",
    ubysId: "ubys_adv_001",
    email: "advisor1@example.com",
    firstName: "Jane",
    lastName: "Advisor",
    role: "ADVISOR" as UserRole,
    isActive: true,
  },
  {
    id: "user7",
    ubysId: "ubys_adv_002",
    email: "advisor2@example.com",
    firstName: "Mark",
    lastName: "Wilson",
    role: "ADVISOR" as UserRole,
    isActive: true,
  },
  {
    id: "user8",
    ubysId: "ubys_adv_003",
    email: "advisor3@example.com",
    firstName: "Sarah",
    lastName: "Johnson",
    role: "ADVISOR" as UserRole,
    isActive: true,
  },
  
  // Department Secretaries
  {
    id: "user9",
    ubysId: "ubys_dep_001",
    email: "depsec1@example.com",
    firstName: "David",
    lastName: "DepartmentSec",
    role: "DEPARTMENT_SECRETARY" as UserRole,
    isActive: true,
  },
  {
    id: "user10",
    ubysId: "ubys_dep_002",
    email: "depsec2@example.com",
    firstName: "Emily",
    lastName: "Clark",
    role: "DEPARTMENT_SECRETARY" as UserRole,
    isActive: true,
  },
  {
    id: "user11",
    ubysId: "ubys_dep_003",
    email: "depsec3@example.com",
    firstName: "Thomas",
    lastName: "Brown",
    role: "DEPARTMENT_SECRETARY" as UserRole,
    isActive: true,
  },
  
  // Faculty Secretaries
  {
    id: "user12",
    ubysId: "ubys_fac_001",
    email: "facsec1@example.com",
    firstName: "Mary",
    lastName: "FacultySec",
    role: "FACULTY_SECRETARY" as UserRole,
    isActive: true,
  },
  {
    id: "user13",
    ubysId: "ubys_fac_002",
    email: "facsec2@example.com",
    firstName: "James",
    lastName: "Taylor",
    role: "FACULTY_SECRETARY" as UserRole,
    isActive: true,
  },
  {
    id: "user14",
    ubysId: "ubys_fac_003",
    email: "facsec3@example.com",
    firstName: "Patricia",
    lastName: "Miller",
    role: "FACULTY_SECRETARY" as UserRole,
    isActive: true,
  },
  
  // Student Affairs Staff
  {
    id: "user15",
    ubysId: "ubys_aff_001",
    email: "affairs1@example.com",
    firstName: "Robert",
    lastName: "Affairs",
    role: "STUDENT_AFFAIRS" as UserRole,
    isActive: true,
  },
  {
    id: "user16",
    ubysId: "ubys_aff_002",
    email: "affairs2@example.com",
    firstName: "Jennifer",
    lastName: "White",
    role: "STUDENT_AFFAIRS" as UserRole,
    isActive: true,
  }
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