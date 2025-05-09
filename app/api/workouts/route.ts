import { NextResponse } from "next/server"

// Mock data for workouts
const workouts = [
  {
    id: 1,
    name: "Upper Body Strength",
    description: "Focus on chest, shoulders, and triceps",
    duration: "45 min",
    difficulty: "Intermediate",
    exercises: [
      { name: "Bench Press", sets: 4, reps: "8-10", weight: "70% 1RM" },
      { name: "Overhead Press", sets: 3, reps: "10-12", weight: "60% 1RM" },
      { name: "Incline Dumbbell Press", sets: 3, reps: "10-12", weight: "30 lbs" },
      { name: "Tricep Pushdowns", sets: 3, reps: "12-15", weight: "40 lbs" },
      { name: "Lateral Raises", sets: 3, reps: "12-15", weight: "15 lbs" },
      { name: "Face Pulls", sets: 3, reps: "15-20", weight: "30 lbs" },
    ],
    scheduled: "2023-05-16T06:00:00Z",
    userId: "user1",
  },
  {
    id: 2,
    name: "Lower Body Power",
    description: "Focus on quads, hamstrings, and glutes",
    duration: "50 min",
    difficulty: "Advanced",
    exercises: [
      { name: "Barbell Squats", sets: 5, reps: "5", weight: "80% 1RM" },
      { name: "Romanian Deadlifts", sets: 3, reps: "8-10", weight: "70% 1RM" },
      { name: "Walking Lunges", sets: 3, reps: "10 each leg", weight: "30 lbs dumbbells" },
      { name: "Leg Press", sets: 3, reps: "12-15", weight: "200 lbs" },
      { name: "Leg Curls", sets: 3, reps: "12-15", weight: "50 lbs" },
      { name: "Calf Raises", sets: 4, reps: "15-20", weight: "Body weight" },
    ],
    scheduled: "2023-05-18T17:30:00Z",
    userId: "user1",
  },
  {
    id: 3,
    name: "Full Body HIIT",
    description: "High intensity interval training",
    duration: "30 min",
    difficulty: "Intermediate",
    exercises: [
      { name: "Burpees", sets: 4, reps: "45 seconds", weight: "Body weight" },
      { name: "Mountain Climbers", sets: 4, reps: "45 seconds", weight: "Body weight" },
      { name: "Kettlebell Swings", sets: 4, reps: "45 seconds", weight: "35 lbs" },
      { name: "Box Jumps", sets: 4, reps: "45 seconds", weight: "Body weight" },
      { name: "Battle Ropes", sets: 4, reps: "45 seconds", weight: "N/A" },
      { name: "Rest", sets: 4, reps: "15 seconds", weight: "N/A" },
    ],
    scheduled: "2023-05-20T09:00:00Z",
    userId: "user1",
  },
]

export async function GET() {
  return NextResponse.json(workouts)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.duration || !body.exercises) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create new workout
    const newWorkout = {
      id: workouts.length + 1,
      name: body.name,
      description: body.description || "",
      duration: body.duration,
      difficulty: body.difficulty || "Beginner",
      exercises: body.exercises,
      scheduled: body.scheduled || null,
      userId: "user1", // In a real app, this would come from authentication
    }

    // Add to workouts (in a real app, this would be a database operation)
    workouts.push(newWorkout)

    return NextResponse.json(newWorkout, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create workout" }, { status: 500 })
  }
}
