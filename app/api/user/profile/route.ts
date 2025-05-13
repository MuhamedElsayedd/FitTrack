import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET user profile
export async function GET() {
  try {
    // Get auth token from cookies
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth-token");
    
    if (!authToken || !authToken.value) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Extract user ID from token
    const tokenParts = authToken.value.split("-");
    if (tokenParts.length < 3 || tokenParts[0] !== "user") {
      return NextResponse.json(
        { error: "Invalid token format" },
        { status: 400 }
      );
    }
    
    const userId = tokenParts[1];
    
    const client = await clientPromise;
    const db = client.db("FitTrack");
    
    // Get user from database
    const user = await db.collection("users").findOne(
      { _id: new ObjectId(userId) },
      { projection: { password: 0 } } // Exclude password
    );
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(user);
  } catch (error) {
    console.error("❌ Failed to fetch user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}

// UPDATE user profile
export async function PUT(request: Request) {
  try {
    const { name, email } = await request.json();
    
    // Get auth token from cookies
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth-token");
    
    if (!authToken || !authToken.value) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Extract user ID from token
    const tokenParts = authToken.value.split("-");
    if (tokenParts.length < 3 || tokenParts[0] !== "user") {
      return NextResponse.json(
        { error: "Invalid token format" },
        { status: 400 }
      );
    }
    
    const userId = tokenParts[1];
    
    const client = await clientPromise;
    const db = client.db("FitTrack");
    
    // Check if email is already in use by another user
    if (email) {
      const existingUser = await db.collection("users").findOne({
        email,
        _id: { $ne: new ObjectId(userId) }
      });
      
      if (existingUser) {
        return NextResponse.json(
          { error: "Email is already in use" },
          { status: 400 }
        );
      }
    }
    
    // Update user in database
    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $set: { 
        name: name || undefined,
        email: email || undefined,
        updatedAt: new Date()
      } }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: "Profile updated successfully"
    });
  } catch (error) {
    console.error("❌ Failed to update user profile:", error);
    return NextResponse.json(
      { error: "Failed to update user profile" },
      { status: 500 }
    );
  }
}