// app/api/test/route.ts
import clientPromise from "@/lib/mongodb"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("FitTrack")

    // Just to verify connection, get list of collections
    const collections = await db.listCollections().toArray()

    return NextResponse.json({
      message: "✅ MongoDB Connected Successfully!",
      collections: collections.map(col => col.name),
    })
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error)
    return NextResponse.json({ error: "Failed to connect to MongoDB" }, { status: 500 })
  }
}
