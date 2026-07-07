import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: "userId query parameter is required" }, { status: 400 });
    }

    const transactions = await db.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(transactions);
  } catch (error: any) {
    console.error("Error fetching payment history:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch payment history" }, { status: 500 });
  }
}
