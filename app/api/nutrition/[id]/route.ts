import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid entry ID" },
        { status: 400 }
      )

      
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
    
    // Find and delete the entry
    const result = await db.collection("nutrition").deleteOne({
      _id: new ObjectId(id),
      userId: userId
    })
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Entry not found or not authorized to delete" },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { success: true, message: "Entry deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Failed to delete nutrition entry:", error)
    return NextResponse.json(
      { error: "Failed to delete nutrition entry" },
      { status: 500 }
    )
  }
}