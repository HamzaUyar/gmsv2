import { NextRequest, NextResponse } from "next/server";

// Mock transcript data for demo purposes
const mockTranscripts: Record<string, any> = {
  "ubys_std_001": {
    studentInfo: {
      ubysId: "ubys_std_001",
      studentNo: "202011001",
      firstName: "John",
      lastName: "Student",
      departmentName: "Computer Engineering",
      facultyName: "Engineering Faculty"
    },
    semesters: [
      {
        semesterCode: "2020-FALL",
        courses: [
          { courseCode: "CS101", courseName: "Intro to Programming", credits: 6, grade: "AA", numericGrade: 4.0 },
          { courseCode: "MATH101", courseName: "Calculus I", credits: 5, grade: "BA", numericGrade: 3.5 },
          { courseCode: "PHYS101", courseName: "Physics I", credits: 4, grade: "BB", numericGrade: 3.0 },
          { courseCode: "ENG101", courseName: "English I", credits: 3, grade: "CB", numericGrade: 2.5 }
        ],
        semesterGpa: 3.44
      },
      {
        semesterCode: "2021-SPRING",
        courses: [
          { courseCode: "CS102", courseName: "Data Structures", credits: 6, grade: "AA", numericGrade: 4.0 },
          { courseCode: "MATH102", courseName: "Calculus II", credits: 5, grade: "BB", numericGrade: 3.0 },
          { courseCode: "PHYS102", courseName: "Physics II", credits: 4, grade: "BA", numericGrade: 3.5 },
          { courseCode: "ENG102", courseName: "English II", credits: 3, grade: "BB", numericGrade: 3.0 }
        ],
        semesterGpa: 3.50
      },
      {
        semesterCode: "2021-FALL",
        courses: [
          { courseCode: "CS201", courseName: "Algorithms", credits: 6, grade: "BA", numericGrade: 3.5 },
          { courseCode: "CS203", courseName: "Computer Organization", credits: 5, grade: "BB", numericGrade: 3.0 },
          { courseCode: "MATH201", courseName: "Linear Algebra", credits: 4, grade: "AA", numericGrade: 4.0 },
          { courseCode: "STAT201", courseName: "Probability", credits: 3, grade: "BA", numericGrade: 3.5 }
        ],
        semesterGpa: 3.50
      },
      {
        semesterCode: "2022-SPRING",
        courses: [
          { courseCode: "CS202", courseName: "Database Systems", credits: 6, grade: "AA", numericGrade: 4.0 },
          { courseCode: "CS204", courseName: "Operating Systems", credits: 5, grade: "BB", numericGrade: 3.0 },
          { courseCode: "CS206", courseName: "Software Engineering", credits: 4, grade: "BA", numericGrade: 3.5 },
          { courseCode: "MATH202", courseName: "Differential Equations", credits: 3, grade: "CB", numericGrade: 2.5 }
        ],
        semesterGpa: 3.42
      },
      {
        semesterCode: "2022-FALL",
        courses: [
          { courseCode: "CS301", courseName: "Computer Networks", credits: 6, grade: "BA", numericGrade: 3.5 },
          { courseCode: "CS303", courseName: "Artificial Intelligence", credits: 5, grade: "AA", numericGrade: 4.0 },
          { courseCode: "CS305", courseName: "Web Programming", credits: 4, grade: "BB", numericGrade: 3.0 },
          { courseCode: "CS307", courseName: "Mobile Programming", credits: 3, grade: "BA", numericGrade: 3.5 }
        ],
        semesterGpa: 3.56
      },
      {
        semesterCode: "2023-SPRING",
        courses: [
          { courseCode: "CS302", courseName: "Compiler Design", credits: 6, grade: "BB", numericGrade: 3.0 },
          { courseCode: "CS304", courseName: "Computer Graphics", credits: 5, grade: "BA", numericGrade: 3.5 },
          { courseCode: "CS306", courseName: "Cloud Computing", credits: 4, grade: "AA", numericGrade: 4.0 },
          { courseCode: "CS308", courseName: "Distributed Systems", credits: 3, grade: "BB", numericGrade: 3.0 }
        ],
        semesterGpa: 3.39
      },
      {
        semesterCode: "2023-FALL",
        courses: [
          { courseCode: "CS401", courseName: "Machine Learning", credits: 6, grade: "AA", numericGrade: 4.0 },
          { courseCode: "CS403", courseName: "Information Security", credits: 5, grade: "BA", numericGrade: 3.5 },
          { courseCode: "CS405", courseName: "Graduation Project I", credits: 4, grade: "AA", numericGrade: 4.0 },
          { courseCode: "CS407", courseName: "Big Data Analytics", credits: 3, grade: "BB", numericGrade: 3.0 }
        ],
        semesterGpa: 3.72
      },
      {
        semesterCode: "2024-SPRING",
        courses: [
          { courseCode: "CS402", courseName: "Deep Learning", credits: 6, grade: "BA", numericGrade: 3.5 },
          { courseCode: "CS404", courseName: "Blockchain Technology", credits: 5, grade: "AA", numericGrade: 4.0 },
          { courseCode: "CS406", courseName: "Graduation Project II", credits: 4, grade: "AA", numericGrade: 4.0 },
          { courseCode: "CS408", courseName: "Ethics in Computing", credits: 3, grade: "BA", numericGrade: 3.5 }
        ],
        semesterGpa: 3.78
      }
    ],
    summary: {
      cumulativeGpa: 3.65,
      totalCreditsEarned: 136,
      graduationStatusUBYS: "Potentially Eligible"
    }
  }
};

// Add more mock transcripts for other students as needed

export async function GET(
  request: NextRequest,
  { params }: { params: { studentUbysId: string } }
) {
  const { studentUbysId } = params;
  
  // Simulate a delay to mimic real API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Check if we have a transcript for this student
  if (mockTranscripts[studentUbysId]) {
    return NextResponse.json(mockTranscripts[studentUbysId], { status: 200 });
  }
  
  // Return a generic transcript if we don't have one for this student
  return NextResponse.json(
    {
      error: "Transcript not found for this student",
      studentUbysId
    },
    { status: 404 }
  );
} 