import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const MOCK_NOTIFICATIONS = [
  {
    id: "n1",
    title: "New Student Enrollment",
    message: "Felix Chen enrolled in Advanced React Architecture.",
    isRead: false,
    userId: "inst-1",
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString() // 5m ago
  },
  {
    id: "n2",
    title: "Quiz Completion",
    message: "Sarah Miller completed Quiz 4 with 95%.",
    isRead: false,
    userId: "inst-1",
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString() // 15m ago
  },
  {
    id: "n3",
    title: "Syllabus Update Success",
    message: "Machine Learning syllabus matrices configured correctly.",
    isRead: true,
    userId: "inst-1",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2h ago
  }
];

export async function GET() {
  try {
    const dbNotifications = await db.notification.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(dbNotifications);
  } catch (error) {
    return NextResponse.json(MOCK_NOTIFICATIONS);
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, isRead = true, markAll = false } = body;

    try {
      if (markAll) {
        await db.notification.updateMany({
          data: { isRead }
        });
        return NextResponse.json({ success: true });
      } else {
        const updated = await db.notification.update({
          where: { id },
          data: { isRead }
        });
        return NextResponse.json(updated);
      }
    } catch (dbError) {
      // Mock success handling
      return NextResponse.json({ success: true, id, isRead });
    }
  } catch (error) {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }
}
