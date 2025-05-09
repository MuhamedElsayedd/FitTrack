import { NextResponse } from "next/server"

// Mock data for goals
const goals = [
  {
    id: 1,
    name: "Daily Steps",
    target: 10000,
    current: 8249,
    unit: "steps",
    period: "daily",
    userId: "user1",
  },
  {
    id: 2,
    name: "Weekly Running Distance",
    target: 20,
    current: 13.5,
    unit: "km",
    period: "weekly",
    userId: "user1",
  },
  {
    id: 3,
    name: "Monthly Workout Sessions",
    target: 20,
    current: 12,
    unit: "sessions",
    period: "monthly",
    userId: "user1",
  },
  {
    id: 4,
    name: "Weight Goal",
    target: 70,
    current: 75,
    unit: "kg",
    period: "overall",
    isReverse: true,
    userId: "user1",
  },
]

export async function GET() {
  return NextResponse.json(goals)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.target || !body.unit || !body.period) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create new goal
    const newGoal = {
      id: goals.length + 1,
      name: body.name,
      target: body.target,
      current: body.current || 0,
      unit: body.unit,
      period: body.period,
      isReverse: body.isReverse || false,
      userId: "user1", // In a real app, this would come from authentication
    }

    // Add to goals (in a real app, this would be a database operation)
    goals.push(newGoal)

    return NextResponse.json(newGoal, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create goal" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.id || body.current === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Find and update goal
    const goalIndex = goals.findIndex((goal) => goal.id === body.id)

    if (goalIndex === -1) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 })
    }

    goals[goalIndex] = {
      ...goals[goalIndex],
      current: body.current,
    }

    return NextResponse.json(goals[goalIndex])
  } catch (error) {
    return NextResponse.json({ error: "Failed to update goal" }, { status: 500 })
  }
}
