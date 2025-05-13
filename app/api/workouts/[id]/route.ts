import { NextResponse, NextRequest } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { cookies } from "next/headers"

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    // Get auth token from cookies
    const cookieStore = await cookies()
    const authToken = cookieStore.get("auth-token")?.value
    
    if (!authToken) {
      console.log("No auth token found")
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    
    // Extract user ID from token (format: user-{id}-{timestamp})
    const tokenParts = authToken.split("-")
    if (tokenParts.length < 3 || tokenParts[0] !== "user") {
      console.log("Invalid token format:", tokenParts)
      return NextResponse.json(
        { error: "Invalid token format" },
        { status: 400 }
      )
    }
    
    const userId = tokenParts[1]
    
    const client = await clientPromise
    const db = client.db("FitTrack")
    
    // Delete the workout
    const result = await db.collection("workouts").deleteOne({
      _id: new ObjectId(id),
      userId
    })
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Workout not found or not authorized" },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { success: true, message: "Workout deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("❌ Failed to delete workout:", error)
    return NextResponse.json(
      { error: "Failed to delete workout" },
      { status: 500 }
    )
  }
}