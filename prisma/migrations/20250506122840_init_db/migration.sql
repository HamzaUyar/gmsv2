-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('STUDENT', 'ADVISOR', 'DEPARTMENT_SECRETARY', 'FACULTY_SECRETARY', 'STUDENT_AFFAIRS');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING_ADVISOR_APPROVAL', 'PENDING_DEPARTMENT_SECRETARY_APPROVAL', 'PENDING_FACULTY_SECRETARY_APPROVAL', 'PENDING_STUDENT_AFFAIRS_TRANSCRIPT_APPROVAL', 'PENDING_STUDENT_AFFAIRS_DOCUMENT_APPROVAL', 'APPROVED_COMPLETED', 'REJECTED_ADVISOR', 'REJECTED_DEPARTMENT_SECRETARY', 'REJECTED_FACULTY_SECRETARY', 'REJECTED_STUDENT_AFFAIRS_TRANSCRIPT', 'REJECTED_STUDENT_AFFAIRS_DOCUMENT');

-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "CertificateType" AS ENUM ('HONOUR', 'HIGH_HONOUR');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "ubysId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Faculty" (
    "id" TEXT NOT NULL,
    "ubysFacultyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Faculty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" TEXT NOT NULL,
    "ubysDepartmentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "facultyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "studentNo" TEXT NOT NULL,
    "nationalId" TEXT,
    "birthDate" TIMESTAMP(3),
    "enrollmentDate" TIMESTAMP(3),
    "classLevel" INTEGER NOT NULL DEFAULT 4,
    "departmentId" TEXT NOT NULL,
    "facultyId" TEXT NOT NULL,
    "advisorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdvisorProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "facultyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdvisorProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DepartmentSecretaryProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DepartmentSecretaryProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FacultySecretaryProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "facultyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FacultySecretaryProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentAffairsProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentAffairsProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transcript" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "ubysTranscriptId" TEXT,
    "jsonData" JSONB NOT NULL,
    "gpa" DOUBLE PRECISION NOT NULL,
    "totalCredits" DOUBLE PRECISION NOT NULL,
    "isEligibleForGraduation" BOOLEAN NOT NULL DEFAULT false,
    "pulledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transcript_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GraduationApplication" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "transcriptId" TEXT NOT NULL,
    "applicationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING_ADVISOR_APPROVAL',
    "advisorApprovalStatus" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "advisorApprovedById" TEXT,
    "advisorApprovalDate" TIMESTAMP(3),
    "advisorNotes" TEXT,
    "departmentApprovalId" TEXT,
    "departmentNotes" TEXT,
    "facultyApprovalId" TEXT,
    "facultyNotes" TEXT,
    "studentAffairsTranscriptApprovalId" TEXT,
    "studentAffairsTranscriptNotes" TEXT,
    "departmentRank" INTEGER,
    "facultyRank" INTEGER,
    "universityRank" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GraduationApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DepartmentGraduationApproval" (
    "id" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "approvalPeriodName" TEXT,
    "status" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "secretaryProcessedById" TEXT,
    "secretaryProcessedAt" TIMESTAMP(3),
    "notes" TEXT,
    "allAdvisorApprovalsCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DepartmentGraduationApproval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FacultyGraduationApproval" (
    "id" TEXT NOT NULL,
    "facultyId" TEXT NOT NULL,
    "approvalPeriodName" TEXT,
    "status" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "secretaryProcessedById" TEXT,
    "secretaryProcessedAt" TIMESTAMP(3),
    "notes" TEXT,
    "allDepartmentApprovalsCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FacultyGraduationApproval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UniversityGraduationApproval" (
    "id" TEXT NOT NULL,
    "approvalPeriodName" TEXT,
    "transcriptApprovalStatus" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "staffTranscriptProcessedById" TEXT,
    "staffTranscriptProcessedAt" TIMESTAMP(3),
    "transcriptNotes" TEXT,
    "allFacultyApprovalsCompleted" BOOLEAN NOT NULL DEFAULT false,
    "documentApprovalStatus" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "staffDocumentProcessedById" TEXT,
    "staffDocumentProcessedAt" TIMESTAMP(3),
    "documentNotes" TEXT,
    "allDocumentsGenerated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UniversityGraduationApproval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Diploma" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "graduationApplicationId" TEXT NOT NULL,
    "diplomaNumber" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3),
    "filePath" TEXT,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finalApprovalStatus" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "finalApprovedById" TEXT,
    "finalApprovalDate" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Diploma_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certificate" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "graduationApplicationId" TEXT NOT NULL,
    "type" "CertificateType" NOT NULL,
    "certificateNumber" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3),
    "filePath" TEXT,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finalApprovalStatus" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "finalApprovedById" TEXT,
    "finalApprovalDate" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_ubysId_key" ON "User"("ubysId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Faculty_ubysFacultyId_key" ON "Faculty"("ubysFacultyId");

-- CreateIndex
CREATE UNIQUE INDEX "Department_ubysDepartmentId_key" ON "Department"("ubysDepartmentId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentProfile_userId_key" ON "StudentProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentProfile_studentNo_key" ON "StudentProfile"("studentNo");

-- CreateIndex
CREATE UNIQUE INDEX "AdvisorProfile_userId_key" ON "AdvisorProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DepartmentSecretaryProfile_userId_key" ON "DepartmentSecretaryProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DepartmentSecretaryProfile_departmentId_key" ON "DepartmentSecretaryProfile"("departmentId");

-- CreateIndex
CREATE UNIQUE INDEX "FacultySecretaryProfile_userId_key" ON "FacultySecretaryProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentAffairsProfile_userId_key" ON "StudentAffairsProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "GraduationApplication_studentId_key" ON "GraduationApplication"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "GraduationApplication_transcriptId_key" ON "GraduationApplication"("transcriptId");

-- CreateIndex
CREATE UNIQUE INDEX "GraduationApplication_departmentApprovalId_key" ON "GraduationApplication"("departmentApprovalId");

-- CreateIndex
CREATE UNIQUE INDEX "GraduationApplication_facultyApprovalId_key" ON "GraduationApplication"("facultyApprovalId");

-- CreateIndex
CREATE UNIQUE INDEX "GraduationApplication_studentAffairsTranscriptApprovalId_key" ON "GraduationApplication"("studentAffairsTranscriptApprovalId");

-- CreateIndex
CREATE UNIQUE INDEX "DepartmentGraduationApproval_departmentId_approvalPeriodNam_key" ON "DepartmentGraduationApproval"("departmentId", "approvalPeriodName");

-- CreateIndex
CREATE UNIQUE INDEX "FacultyGraduationApproval_facultyId_approvalPeriodName_key" ON "FacultyGraduationApproval"("facultyId", "approvalPeriodName");

-- CreateIndex
CREATE UNIQUE INDEX "UniversityGraduationApproval_approvalPeriodName_key" ON "UniversityGraduationApproval"("approvalPeriodName");

-- CreateIndex
CREATE UNIQUE INDEX "Diploma_studentId_key" ON "Diploma"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "Diploma_graduationApplicationId_key" ON "Diploma"("graduationApplicationId");

-- CreateIndex
CREATE UNIQUE INDEX "Diploma_diplomaNumber_key" ON "Diploma"("diplomaNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_certificateNumber_key" ON "Certificate"("certificateNumber");

-- CreateIndex
CREATE INDEX "Certificate_studentId_type_idx" ON "Certificate"("studentId", "type");

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "Faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentProfile" ADD CONSTRAINT "StudentProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentProfile" ADD CONSTRAINT "StudentProfile_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentProfile" ADD CONSTRAINT "StudentProfile_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "Faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentProfile" ADD CONSTRAINT "StudentProfile_advisorId_fkey" FOREIGN KEY ("advisorId") REFERENCES "AdvisorProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdvisorProfile" ADD CONSTRAINT "AdvisorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdvisorProfile" ADD CONSTRAINT "AdvisorProfile_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdvisorProfile" ADD CONSTRAINT "AdvisorProfile_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "Faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepartmentSecretaryProfile" ADD CONSTRAINT "DepartmentSecretaryProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepartmentSecretaryProfile" ADD CONSTRAINT "DepartmentSecretaryProfile_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacultySecretaryProfile" ADD CONSTRAINT "FacultySecretaryProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacultySecretaryProfile" ADD CONSTRAINT "FacultySecretaryProfile_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "Faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAffairsProfile" ADD CONSTRAINT "StudentAffairsProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transcript" ADD CONSTRAINT "Transcript_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GraduationApplication" ADD CONSTRAINT "GraduationApplication_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GraduationApplication" ADD CONSTRAINT "GraduationApplication_transcriptId_fkey" FOREIGN KEY ("transcriptId") REFERENCES "Transcript"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GraduationApplication" ADD CONSTRAINT "GraduationApplication_advisorApprovedById_fkey" FOREIGN KEY ("advisorApprovedById") REFERENCES "AdvisorProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GraduationApplication" ADD CONSTRAINT "GraduationApplication_departmentApprovalId_fkey" FOREIGN KEY ("departmentApprovalId") REFERENCES "DepartmentGraduationApproval"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GraduationApplication" ADD CONSTRAINT "GraduationApplication_facultyApprovalId_fkey" FOREIGN KEY ("facultyApprovalId") REFERENCES "FacultyGraduationApproval"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GraduationApplication" ADD CONSTRAINT "GraduationApplication_studentAffairsTranscriptApprovalId_fkey" FOREIGN KEY ("studentAffairsTranscriptApprovalId") REFERENCES "UniversityGraduationApproval"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepartmentGraduationApproval" ADD CONSTRAINT "DepartmentGraduationApproval_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepartmentGraduationApproval" ADD CONSTRAINT "DepartmentGraduationApproval_secretaryProcessedById_fkey" FOREIGN KEY ("secretaryProcessedById") REFERENCES "DepartmentSecretaryProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacultyGraduationApproval" ADD CONSTRAINT "FacultyGraduationApproval_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "Faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacultyGraduationApproval" ADD CONSTRAINT "FacultyGraduationApproval_secretaryProcessedById_fkey" FOREIGN KEY ("secretaryProcessedById") REFERENCES "FacultySecretaryProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UniversityGraduationApproval" ADD CONSTRAINT "UniversityGraduationApproval_staffTranscriptProcessedById_fkey" FOREIGN KEY ("staffTranscriptProcessedById") REFERENCES "StudentAffairsProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UniversityGraduationApproval" ADD CONSTRAINT "UniversityGraduationApproval_staffDocumentProcessedById_fkey" FOREIGN KEY ("staffDocumentProcessedById") REFERENCES "StudentAffairsProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diploma" ADD CONSTRAINT "Diploma_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diploma" ADD CONSTRAINT "Diploma_graduationApplicationId_fkey" FOREIGN KEY ("graduationApplicationId") REFERENCES "GraduationApplication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diploma" ADD CONSTRAINT "Diploma_finalApprovedById_fkey" FOREIGN KEY ("finalApprovedById") REFERENCES "StudentAffairsProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_graduationApplicationId_fkey" FOREIGN KEY ("graduationApplicationId") REFERENCES "GraduationApplication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_finalApprovedById_fkey" FOREIGN KEY ("finalApprovedById") REFERENCES "StudentAffairsProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
