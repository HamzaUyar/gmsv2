# University Graduation Management System (GMS)

A web-based system designed to streamline the university graduation approval process, from student transcript evaluation to diploma and certificate generation.

## Project Overview

The University Graduation Management System (GMS) is a comprehensive platform that manages the entire graduation approval workflow for universities. It involves various user roles (Students, Advisors, Department Secretaries, Faculty Secretaries, and Student Affairs Staff) and integrates with a mock "UBYS" (University Information Management System) API for data retrieval.

### Key Features

- **Role-Based Access Control**: Different user interfaces and permissions based on roles
- **Transcript Evaluation**: Automated eligibility checks based on GPA and credit requirements
- **Multi-Level Approval Workflow**: Hierarchical approval process from advisors to student affairs
- **Student Ranking**: Automatic ranking at department, faculty, and university levels
- **Document Generation**: Simulated diploma and certificate generation with approval workflow

## Technology Stack

- **Frontend**: Next.js (React), Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js

## User Roles & Workflows

### Student
- View transcript and graduation eligibility status
- Track graduation application progress
- View approved documents (diploma, certificates)

### Advisor
- Review assigned students' transcripts
- Approve or reject graduation eligibility

### Department Secretary
- View students approved by advisors within their department
- Review department-level rankings
- Approve the entire department's list

### Faculty Secretary
- View lists approved by Department Secretaries within their faculty
- Review faculty-level rankings
- Approve the entire faculty's list

### Student Affairs Staff
- Initialize system data from UBYS
- Review university-level rankings
- Provide final approval for transcripts
- Generate and approve diplomas and certificates

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- PostgreSQL database

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd gms
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/gms_db?schema=public"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. Set up the database:
   ```
   npx prisma migrate dev --name init
   ```

5. Run the development server:
   ```
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Credentials

For testing purposes, you can use the following mock UBYS IDs:

- Student: `ubys_std_001`
- Advisor: `ubys_adv_001`
- Department Secretary: `ubys_dep_001`
- Faculty Secretary: `ubys_fac_001`
- Student Affairs: `ubys_aff_001`

Any password will work with the demo system.

## Project Structure

- `/app`: Next.js App Router components and pages
- `/app/api`: API routes for backend functionality
- `/app/api/mock/ubys`: Mock UBYS API endpoints
- `/app/components`: Reusable UI components
- `/app/(pages)`: Role-specific dashboard pages
- `/prisma`: Database schema and migrations
- `/lib`: Utility functions and shared code

## License

This project is licensed under the MIT License.
