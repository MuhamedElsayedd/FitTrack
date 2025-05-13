import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { cookies } from "next/headers"

// PUT handler for updating an activity
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const body = await request.json()
    
    console.log("Updating activity:", id, body)
    
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
    
    console.log("Auth token:", authToken)
    
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
    console.log("User ID:", userId)
    
    const client = await clientPromise
    const db = client.db("FitTrack")
    
    // Update the activity
    const result = await db.collection("activities").updateOne(
      { _id: new ObjectId(id), userId },
      { $set: {
          type: body.type,
          duration: body.duration,
          distance: body.distance,
          calories: body.calories,
          date: body.date,
          updatedAt: new Date()
        }
      }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Activity not found or not authorized" },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { success: true, message: "Activity updated successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("❌ Failed to update activity:", error)
    return NextResponse.json(
      { error: "Failed to update activity" },
      { status: 500 }
    )
  }
}

// DELETE handler for deleting an activity
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
    
    // Delete the activity
    const result = await db.collection("activities").deleteOne({
      _id: new ObjectId(id),
      userId
    })
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Activity not found or not authorized" },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { success: true, message: "Activity deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("❌ Failed to delete activity:", error)
    return NextResponse.json(
      { error: "Failed to delete activity" },
      { status: 500 }
    )
  }
}


