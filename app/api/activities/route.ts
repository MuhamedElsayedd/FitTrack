import { NextResponse } from "next/server"

// Mock data for activities
const activities = [
  {
    id: 1,
    type: "Running",
    duration: "30 min",
    distance: "5 km",
    calories: 320,
    date: "2023-05-15T08:30:00Z",
    userId: "user1",
  },
  {
    id: 2,
    type: "Cycling",
    duration: "45 min",
    distance: "15 km",
    calories: 420,
    date: "2023-05-15T17:30:00Z",
    userId: "user1",
  },
  {
    id: 3,
    type: "Swimming",
    duration: "40 min",
    distance: "1 km",
    calories: 350,
    date: "2023-05-14T07:00:00Z",
    userId: "user1",
  },
  {
    id: 4,
    type: "Yoga",
    duration: "60 min",
    distance: null,
    calories: 180,
    date: "2023-05-14T18:30:00Z",
    userId: "user1",
  },
  {
    id: 5,
    type: "Weight Training",
    duration: "50 min",
    distance: null,
    calories: 280,
    date: "2023-05-13T16:00:00Z",
    userId: "user1",
  },
  {
    id: 6,
    type: "Walking",
    duration: "35 min",
    distance: "3 km",
    calories: 150,
    date: "2023-05-12T12:30:00Z",
    userId: "user1",
  },
]

export async function GET() {
  return NextResponse.json(activities)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.type || !body.duration || !body.calories) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create new activity
    const newActivity = {
      id: activities.length + 1,
      type: body.type,
      duration: body.duration,
      distance: body.distance || null,
      calories: body.calories,
      date: body.date || new Date().toISOString(),
      userId: "user1", // In a real app, this would come from authentication
    }

    // Add to activities (in a real app, this would be a database operation)
    activities.push(newActivity)

    return NextResponse.json(newActivity, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create activity" }, { status: 500 })
  }
}
