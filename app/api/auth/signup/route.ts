import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("FitTrack");
    const usersCollection = db.collection("users");

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const result = await usersCollection.insertOne({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    // Create auth token
    const token = `user-${result.insertedId}-${Date.now()}`;

    return NextResponse.json(
      {
        message: "User created successfully",
        user: { id: result.insertedId, name, email },
        token,
      },
      { 
        status: 201,
        headers: {
          'Set-Cookie': `auth-token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; HttpOnly` // 7 days
        }
      }
    );
  } catch (error) {
    console.error("❌ Signup failed:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}