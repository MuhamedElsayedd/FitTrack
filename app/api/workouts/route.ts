import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { cookies } from "next/headers"

export async function GET() {
  try {
    // Get auth token from cookies
    const cookieStore = await cookies()
    const authToken = cookieStore.get("auth-token")?.value
    
    if (!authToken) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    
    // Extract user ID from token
    const tokenParts = authToken.split("-")
    if (tokenParts.length < 3 || tokenParts[0] !== "user") {
      return NextResponse.json(
        { error: "Invalid token format" },
        { status: 400 }
      )
    }
    
    const userId = tokenParts[1]
    
    const client = await clientPromise
    const db = client.db("FitTrack")
    
    // Get workouts for the user
    const workouts = await db.collection("workouts")
      .find({ userId })
      .sort({ scheduled: 1 })
      .toArray()
    
    return NextResponse.json(workouts)
  } catch (error) {
    console.error("❌ Failed to fetch workouts:", error)
    return NextResponse.json(
      { error: "Failed to fetch workouts" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.duration || !body.exercises) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get auth token from cookies
    const cookieStore = await cookies()
    const authToken = cookieStore.get("auth-token")?.value
    
    if (!authToken) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    
    // Extract user ID from token
    const tokenParts = authToken.split("-")
    if (tokenParts.length < 3 || tokenParts[0] !== "user") {
      return NextResponse.json(
        { error: "Invalid token format" },
        { status: 400 }
      )
    }
    
    const userId = tokenParts[1]
    
    const client = await clientPromise
    const db = client.db("FitTrack")

    // Create new workout
    const newWorkout = {
      name: body.name,
      description: body.description || "",
      duration: body.duration,
      difficulty: body.difficulty || "Beginner",
      exercises: body.exercises,
      scheduled: body.scheduled || new Date().toISOString(),
      userId,
      createdAt: new Date()
    }

    // Add to workouts collection
    const result = await db.collection("workouts").insertOne(newWorkout)

    return NextResponse.json(
      { ...newWorkout, _id: result.insertedId },
      { status: 201 }
    )
  } catch (error) {
    console.error("❌ Failed to create workout:", error)
    return NextResponse.json({ error: "Failed to create workout" }, { status: 500 })
  }
}

