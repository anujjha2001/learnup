import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { amount, userId, courseId } = await req.json();
    if (!amount || !userId) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      console.warn("Razorpay API keys missing, using dummy order id for sandbox/fallback mode.");
      const mockOrderId = `order_mock_${Date.now()}`;
      await db.transaction.create({
        data: {
          razorpayOrderId: mockOrderId,
          userId,
          courseId,
          amount: parseFloat(amount),
          status: "PENDING",
        }
      });
      return NextResponse.json({
        id: mockOrderId,
        amount: Math.round(amount * 100),
        currency: "INR",
      });
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const options = {
      amount: Math.round(amount * 100), // in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    
    await db.transaction.create({
      data: {
        razorpayOrderId: order.id,
        userId,
        courseId,
        amount: parseFloat(amount),
        status: "PENDING",
      }
    });

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error: any) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: error.message || "Failed to create order" }, { status: 500 });
  }
}
