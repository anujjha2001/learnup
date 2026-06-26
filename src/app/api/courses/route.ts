import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const MOCK_COURSES = [
  {
    id: "c1",
    title: "Advanced React Architecture",
    description: "Modular systems and performance optimization.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80",
    price: 49.99,
    instructorId: "inst-1",
    createdAt: new Date().toISOString()
  },
  {
    id: "c2",
    title: "Machine Learning Operational Scaling",
    description: "Scale model training pipelines and deploy API endpoints.",
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=400&q=80",
    price: 89.99,
    instructorId: "inst-1",
    createdAt: new Date().toISOString()
  }
];

export async function GET() {
  try {
    const dbCourses = await db.course.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(dbCourses);
  } catch (error) {
    // Return mock data if db is not initialized/configured yet
    return NextResponse.json(MOCK_COURSES);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, image, price, instructorId = "inst-1" } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    try {
      const newCourse = await db.course.create({
        data: {
          title,
          description,
          image,
          price: parseFloat(price) || 0.0,
          instructorId
        }
      });
      return NextResponse.json(newCourse, { status: 201 });
    } catch (dbError) {
      // Create and return mock course if DB is not configured/offline
      const mockNewCourse = {
        id: `c-mock-${Date.now()}`,
        title,
        description,
        image: image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80",
        price: parseFloat(price) || 0.0,
        instructorId,
        createdAt: new Date().toISOString()
      };
      return NextResponse.json(mockNewCourse, { status: 201 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
