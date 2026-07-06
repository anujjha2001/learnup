import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let shareSetting = await db.adminSetting.findUnique({
      where: { key: "admin_revenue_share" }
    });

    if (!shareSetting) {
      shareSetting = await db.adminSetting.create({
        data: {
          key: "admin_revenue_share",
          value: "20"
        }
      });
    }

    return NextResponse.json({
      revenueShare: parseFloat(shareSetting.value)
    });
  } catch (error: any) {
    console.error("Admin settings GET error:", error);
    return NextResponse.json({ error: error.message || "Failed to load admin settings" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { revenueShare } = await req.json();

    if (revenueShare === undefined || isNaN(Number(revenueShare))) {
      return NextResponse.json({ error: "Invalid revenue share" }, { status: 400 });
    }

    const parsedShare = Number(revenueShare);
    if (parsedShare < 0 || parsedShare > 100) {
      return NextResponse.json({ error: "Revenue share must be between 0 and 100" }, { status: 400 });
    }

    const setting = await db.adminSetting.upsert({
      where: { key: "admin_revenue_share" },
      update: { value: String(parsedShare) },
      create: { key: "admin_revenue_share", value: String(parsedShare) }
    });

    return NextResponse.json({
      success: true,
      revenueShare: parseFloat(setting.value)
    });
  } catch (error: any) {
    console.error("Admin settings POST error:", error);
    return NextResponse.json({ error: error.message || "Failed to update admin settings" }, { status: 500 });
  }
}
