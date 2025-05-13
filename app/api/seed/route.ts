import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

const activities = [
  {
    type: "Running",
    duration: "30 min",
    distance: "5 km",
    calories: 320,
    date: "2023-05-15T08:30:00Z",
    userId: "user1",
  },
  {
    type: "Cycling",
    duration: "45 min",
    distance: "15 km",
    calories: 420,
    date: "2023-05-15T17:30:00Z",
    userId: "user1",
  },
  {
    type: "Swimming",
    duration: "40 min",
    distance: "1 km",
    calories: 350,
    date: "2023-05-14T07:00:00Z",
    userId: "user1",
  },
  {
    type: "Yoga",
    duration: "60 min",
    distance: null,
    calories: 180,
    date: "2023-05-14T18:30:00Z",
    userId: "user1",
  },
  {
    type: "Weight Training",
    duration: "50 min",
    distance: null,
    calories: 280,
    date: "2023-05-13T16:00:00Z",
    userId: "user1",
  },
  {
    type: "Walking",
    duration: "35 min",
    distance: "3 km",
    calories: 150,
    date: "2023-05-12T12:30:00Z",
    userId: "user1",
  },
];

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("FitTrack");
    const result = await db.collection("activities").insertMany(activities);

    return NextResponse.json({
      message: "✅ Activities inserted successfully!",
      insertedCount: result.insertedCount,
    });
  } catch (error) {
    console.error("❌ Failed to insert activities:", error);
    return NextResponse.json(
      { error: "Failed to seed activities" },
      { status: 500 }
    );
  }
}
