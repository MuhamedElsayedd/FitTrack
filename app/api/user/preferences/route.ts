import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// UPDATE user preferences
export async function PUT(request: Request) {
  try {
    const { emailNotifications, weeklyReports, units } = await request.json();
    
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
    
    // Update user preferences in database
    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $set: { 
        preferences: {
          emailNotifications,
          weeklyReports,
          units
        },
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
      message: "Preferences updated successfully"
    });
  } catch (error) {
    console.error("❌ Failed to update user preferences:", error);
    return NextResponse.json(
      { error: "Failed to update user preferences" },
      { status: 500 }
    );
  }
}