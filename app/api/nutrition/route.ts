import { NextResponse } from "next/server"

// Mock data for nutrition
const nutritionEntries = [
  {
    id: 1,
    meal: "Breakfast",
    time: "08:00",
    calories: 450,
    protein: 25,
    carbs: 60,
    fat: 15,
    items: [
      { name: "Oatmeal", calories: 150, protein: 5, carbs: 27, fat: 3 },
      { name: "Banana", calories: 105, protein: 1, carbs: 27, fat: 0 },
      { name: "Greek Yogurt", calories: 100, protein: 17, carbs: 6, fat: 0 },
      { name: "Honey", calories: 65, protein: 0, carbs: 17, fat: 0 },
      { name: "Almonds", calories: 30, protein: 1, carbs: 1, fat: 3 },
    ],
    date: "2023-05-15",
    userId: "user1",
  },
  {
    id: 2,
    meal: "Lunch",
    time: "12:30",
    calories: 680,
    protein: 45,
    carbs: 70,
    fat: 20,
    items: [
      { name: "Grilled Chicken Breast", calories: 165, protein: 31, carbs: 0, fat: 3.6 },
      { name: "Brown Rice", calories: 215, protein: 5, carbs: 45, fat: 1.8 },
      { name: "Steamed Broccoli", calories: 55, protein: 3.7, carbs: 11, fat: 0.6 },
      { name: "Olive Oil", calories: 120, protein: 0, carbs: 0, fat: 14 },
      { name: "Apple", calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
    ],
    date: "2023-05-15",
    userId: "user1",
  },
  {
    id: 3,
    meal: "Snack",
    time: "16:00",
    calories: 220,
    protein: 20,
    carbs: 23,
    fat: 8,
    items: [{ name: "Protein Bar", calories: 220, protein: 20, carbs: 23, fat: 8 }],
    date: "2023-05-15",
    userId: "user1",
  },
  {
    id: 4,
    meal: "Dinner",
    time: "19:30",
    calories: 750,
    protein: 50,
    carbs: 70,
    fat: 30,
    items: [
      { name: "Salmon Fillet", calories: 280, protein: 39, carbs: 0, fat: 13 },
      { name: "Sweet Potato", calories: 180, protein: 4, carbs: 41, fat: 0 },
      { name: "Asparagus", calories: 40, protein: 4, carbs: 7, fat: 0 },
      { name: "Quinoa", calories: 120, protein: 4, carbs: 21, fat: 2 },
      { name: "Olive Oil", calories: 120, protein: 0, carbs: 0, fat: 14 },
    ],
    date: "2023-05-15",
    userId: "user1",
  },
]

export async function GET() {
  return NextResponse.json(nutritionEntries)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.meal || !body.calories || !body.items) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create new nutrition entry
    const newEntry = {
      id: nutritionEntries.length + 1,
      meal: body.meal,
      time: body.time || new Date().toTimeString().slice(0, 5),
      calories: body.calories,
      protein: body.protein || 0,
      carbs: body.carbs || 0,
      fat: body.fat || 0,
      items: body.items,
      date: body.date || new Date().toISOString().slice(0, 10),
      userId: "user1", // In a real app, this would come from authentication
    }

    // Add to nutrition entries (in a real app, this would be a database operation)
    nutritionEntries.push(newEntry)

    return NextResponse.json(newEntry, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create nutrition entry" }, { status: 500 })
  }
}
