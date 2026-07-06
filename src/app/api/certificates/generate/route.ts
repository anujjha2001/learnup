import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import { join } from "path";
import qrcode from "qrcode";
import { db } from "@/lib/db";
import { uploadCertificatePDF } from "@/lib/certificate-storage";
import CertificateTemplate from "@/components/certificates/CertificateTemplate";

// Helper to generate a unique certificate code
function generateUniqueCode(studentId: string, courseId: string): string {
  const cleanStudent = studentId.substring(0, 4).toUpperCase();
  const cleanCourse = courseId.substring(0, 4).toUpperCase();
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `LUP-${cleanStudent}-${cleanCourse}-${randomSuffix}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { studentId, courseId } = body;

    if (!studentId || !courseId) {
      return NextResponse.json({ error: "studentId and courseId are required" }, { status: 400 });
    }

    // 1. Fetch Student and Course details from DB
    const student = await db.user.findUnique({ where: { id: studentId } });
    const course = await db.course.findUnique({ where: { id: courseId } });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Check if certificate already exists to avoid duplicate work
    const existing = await db.certificate.findFirst({
      where: { studentId, courseId }
    });
    if (existing) {
      return NextResponse.json({ success: true, certificate: existing, message: "Certificate already exists" });
    }

    // 2. Setup certificate parameters
    const studentName = student.name || "LearnUp Student";
    const courseTitle = course.title;
    const issueDateStr = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const uniqueCode = generateUniqueCode(studentId, courseId);
    
    // Generate QR Code pointing to verification URL
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const verificationUrl = `${appUrl}/verify/${uniqueCode}`;
    const qrCodeDataUrl = await qrcode.toDataURL(verificationUrl, {
      margin: 1,
      width: 150,
      color: {
        dark: "#000000",
        light: "#ffffff",
      }
    });

    // Signature path
    const signaturePath = join(process.cwd(), "public", "signature.png");

    // 3. Render PDF document to buffer using react-pdf
    const element = React.createElement(CertificateTemplate, {
      studentName,
      courseTitle,
      issueDate: issueDateStr,
      uniqueCode,
      qrCodeDataUrl,
      signaturePath,
    });

    const pdfBuffer = await renderToBuffer(element as any);

    // 4. Save PDF to bucket (Supabase or local folder fallback)
    const fileName = `${uniqueCode}.pdf`;
    const pdfUrl = await uploadCertificatePDF(fileName, pdfBuffer);

    // 5. Store certificate record in database
    const certificate = await db.certificate.create({
      data: {
        studentId,
        courseId,
        pdfUrl,
        uniqueCode,
        issueDate: new Date(),
      }
    });

    // Create immediate certificate awarded notification for the student
    await db.notification.create({
      data: {
        title: "Certificate Awarded!",
        message: `Congratulations! Your certificate for ${courseTitle} is ready. View it in your Certificates tab.`,
        type: "CERTIFICATE_AWARDED",
        userId: studentId,
      }
    });

    return NextResponse.json({
      success: true,
      certificate,
    });
  } catch (error: any) {
    console.error("Certificate generation route error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate certificate" }, { status: 500 });
  }
}
