import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";


export async function POST(request: Request) {
  try {
    const { newPassword } = await request.json();
    
    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }
    
    
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth-token");
    
    if (!authToken || !authToken.value) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    
    const tokenParts = authToken.value.split("-");
    if (tokenParts.length < 3 || tokenParts[0] !== "user") {
      return NextResponse.json(
        { error: "Invalid token format" },
        { status: 400 }
      );
    }
    
    const userId = tokenParts[1];
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    const client = await clientPromise;
    const db = client.db("FitTrack");
    
    // Update user password in database
    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $set: { 
        password: hashedPassword,
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
      message: "Password updated successfully"
    });
  } catch (error) {
    console.error("❌ Failed to update password:", error);
    return NextResponse.json(
      { error: "Failed to update password" },
      { status: 500 }
    );
  }
}

