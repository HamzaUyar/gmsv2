import { NextRequest, NextResponse } from "next/server";

// Mock faculty data for demo purposes
const mockFaculties = [
  {
    ubysFacultyId: "fac_001",
    name: "Engineering Faculty",
  },
  {
    ubysFacultyId: "fac_002",
    name: "Business Faculty",
  },
  {
    ubysFacultyId: "fac_003",
    name: "Medicine Faculty",
  },
  {
    ubysFacultyId: "fac_004",
    name: "Law Faculty",
  },
  {
    ubysFacultyId: "fac_005",
    name: "Science Faculty",
  },
];

export async function GET() {
  // Simulate a delay to mimic real API call
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return NextResponse.json(mockFaculties, { status: 200 });
} 