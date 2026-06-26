import { NextResponse } from 'next/server';
import { db, checkDatabaseConnection } from '@/lib/db';

export async function GET() {
  const isConnected = await checkDatabaseConnection();
  if (!isConnected) {
    return NextResponse.json({ error: "Failed to connect to notification data service." }, { status: 500 });
  }

  try {
    const dbNotifications = await db.notification.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(dbNotifications, { status: 200 });
  } catch (error) {
    console.error("GET /api/notifications db read error:", error);
    return NextResponse.json({ error: "Failed to load notifications from database." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const isConnected = await checkDatabaseConnection();
  if (!isConnected) {
    return NextResponse.json({ error: "Failed to connect to notification data service." }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { id, isRead = true, markAll = false } = body;

    if (markAll) {
      await db.notification.updateMany({
        data: { isRead }
      });
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      if (!id) {
        return NextResponse.json({ error: "Notification ID is required" }, { status: 400 });
      }
      const updated = await db.notification.update({
        where: { id },
        data: { isRead }
      });
      return NextResponse.json(updated, { status: 200 });
    }
  } catch (error) {
    console.error("PATCH /api/notifications db update error:", error);
    return NextResponse.json({ error: "Failed to update notification status." }, { status: 500 });
  }
}
