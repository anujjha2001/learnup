-- Supabase PostgreSQL Database Schema
-- Deploys the database structure for the LearnUp LMS Platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Role Enum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'INSTRUCTOR');

-- Create Users Table
CREATE TABLE "User" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "email" TEXT UNIQUE NOT NULL,
    "name" TEXT,
    "phone" TEXT,
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Courses Table
CREATE TABLE "Course" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "title" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "price" DOUBLE PRECISION DEFAULT 0.0 NOT NULL,
    "instructorId" UUID NOT NULL REFERENCES "User"("id") ON DELETE RESTRICT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create CourseEnrollment Join Table
CREATE TABLE "CourseEnrollment" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "courseId" UUID NOT NULL REFERENCES "Course"("id") ON DELETE CASCADE,
    "enrolledAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT "CourseEnrollment_user_course_unique" UNIQUE ("userId", "courseId")
);

-- Create Quiz Table (JSONB Questions format)
CREATE TABLE "Quiz" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "title" TEXT NOT NULL,
    "description" TEXT,
    "courseId" UUID NOT NULL REFERENCES "Course"("id") ON DELETE CASCADE,
    "questions" JSONB NOT NULL DEFAULT '[]'::jsonb,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Submissions Table (JSONB Answers format)
CREATE TABLE "Submission" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "studentId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "quizId" UUID NOT NULL REFERENCES "Quiz"("id") ON DELETE CASCADE,
    "score" INT NOT NULL,
    "answers" JSONB NOT NULL DEFAULT '[]'::jsonb,
    "submittedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Notifications Table
CREATE TABLE "Notification" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN DEFAULT false NOT NULL,
    "userId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indices for performance optimization
CREATE INDEX "Course_instructorId_idx" ON "Course"("instructorId");
CREATE INDEX "CourseEnrollment_userId_idx" ON "CourseEnrollment"("userId");
CREATE INDEX "CourseEnrollment_courseId_idx" ON "CourseEnrollment"("courseId");
CREATE INDEX "Quiz_courseId_idx" ON "Quiz"("courseId");
CREATE INDEX "Submission_studentId_idx" ON "Submission"("studentId");
CREATE INDEX "Submission_quizId_idx" ON "Submission"("quizId");
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- Setup Trigger for updatedAt fields
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_modtime BEFORE UPDATE ON "User" FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_course_modtime BEFORE UPDATE ON "Course" FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_quiz_modtime BEFORE UPDATE ON "Quiz" FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
