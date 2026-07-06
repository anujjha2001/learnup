import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: "userId query parameter is required" }, { status: 400 });
    }

    const wallet = await db.wallet.findUnique({
      where: { userId }
    });

    return NextResponse.json({ balance: wallet?.balance || 0.0 });
  } catch (error: any) {
    console.error("Error fetching wallet balance:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch wallet balance" }, { status: 500 });
  }
}
