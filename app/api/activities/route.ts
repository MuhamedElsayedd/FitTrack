import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { cookies } from "next/headers"

export async function GET() {
  try {
    // Get auth token from cookies
    const cookieStore = await cookies()
    const authToken = cookieStore.get("auth-token")
    
    if (!authToken || !authToken.value) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    
    // Extract user ID from token
    const tokenParts = authToken.value.split("-")
    if (tokenParts.length < 3 || tokenParts[0] !== "user") {
      return NextResponse.json(
        { error: "Invalid token format" },
        { status: 400 }
      )
    }
    
    const userId = tokenParts[1]
    
    const client = await clientPromise
    const db = client.db("FitTrack")
    
    // Get activities for the user
    const activities = await db.collection("activities")
      .find({ userId })
      .sort({ date: -1 })
      .toArray()
    
    return NextResponse.json(activities)
  } catch (error) {
    console.error("❌ Failed to fetch activities:", error)
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.type || !body.duration || !body.calories) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get auth token from cookies
    const cookieStore = await cookies()
    const authToken = cookieStore.get("auth-token")
    
    if (!authToken || !authToken.value) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    
    // Extract user ID from token
    const tokenParts = authToken.value.split("-")
    if (tokenParts.length < 3 || tokenParts[0] !== "user") {
      return NextResponse.json(
        { error: "Invalid token format" },
        { status: 400 }
      )
    }
    
    const userId = tokenParts[1]
    
    const client = await clientPromise
    const db = client.db("FitTrack")
    
    // Create new activity
    const newActivity = {
      type: body.type,
      duration: body.duration,
      distance: body.distance || null,
      calories: body.calories,
      date: body.date || new Date().toISOString(),
      userId,
      createdAt: new Date()
    }

    // Add to activities collection
    const result = await db.collection("activities").insertOne(newActivity)
    
    // Return the created activity with its ID
    return NextResponse.json(
      { ...newActivity, _id: result.insertedId },
      { status: 201 }
    )
  } catch (error) {
    console.error("❌ Failed to create activity:", error)
    return NextResponse.json(
      { error: "Failed to create activity" },
      { status: 500 }
    )
  }
}


