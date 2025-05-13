import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";

export async function DELETE(request: Request) {
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
    
    // Extract user ID from token (format: user-{id}-{timestamp})
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
    
    // Delete user data from all collections
    const collections = ["users", "activities", "goals", "nutrition", "workouts"];
    
    for (const collection of collections) {
      await db.collection(collection).deleteMany({ 
        $or: [
          { userId: userId },
          { _id: new ObjectId(userId) }
        ]
      });
    }
    
    // Clear the auth cookie
    return NextResponse.json(
      { message: "Account deleted successfully" },
      { 
        status: 200,
        headers: {
          'Set-Cookie': `auth-token=; Path=/; Max-Age=0; HttpOnly; SameSite=Strict`
        }
      }
    );
  } catch (error) {
    console.error("❌ Account deletion failed:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}