import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { cookies } from "next/headers"

export async function GET() {
  try {
    // Get auth token from cookies
    const cookieStore = await cookies()
    const authToken = (await cookieStore).get("auth-token")?.value
    
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
    
    // Get nutrition entries for the user
    const nutritionEntries = await db.collection("nutrition")
      .find({ userId })
      .sort({ date: -1, time: -1 })
      .toArray()
    
    return NextResponse.json(nutritionEntries)
  } catch (error) {
    console.error("❌ Failed to fetch nutrition entries:", error)
    return NextResponse.json(
      { error: "Failed to fetch nutrition entries" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("Received nutrition entry:", body)

    // Validate required fields
    if (!body.meal || body.calories === undefined || !body.items) {
      return NextResponse.json({ 
        error: "Missing required fields", 
        receivedData: body 
      }, { status: 400 })
    }

    // Get auth token from cookies
    const cookieStore = cookies()
    const authToken = (await cookieStore).get("auth-token")?.value
    
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

    // Create new nutrition entry
    const newEntry = {
      meal: body.meal,
      time: body.time || new Date().toTimeString().slice(0, 5),
      calories: Number(body.calories),
      protein: Number(body.protein || 0),
      carbs: Number(body.carbs || 0),
      fat: Number(body.fat || 0),
      items: body.items,
      date: body.date || new Date().toISOString().slice(0, 10),
      userId,
      createdAt: new Date()
    }

    console.log("Creating nutrition entry:", newEntry)

    // Add to nutrition collection
    const result = await db.collection("nutrition").insertOne(newEntry)

    return NextResponse.json(
      { ...newEntry, _id: result.insertedId },
      { status: 201 }
    )
  } catch (error) {
    console.error("❌ Failed to create nutrition entry:", error)
    return NextResponse.json({ 
      error: "Failed to create nutrition entry",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}



