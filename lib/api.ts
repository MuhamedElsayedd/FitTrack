// API client for the fitness tracker

// Activities
export async function getActivities() {
  const response = await fetch("/api/activities")
  if (!response.ok) {
    throw new Error("Failed to fetch activities")
  }
  return response.json()
}

export async function addActivity(activity: any) {
  const response = await fetch("/api/activities", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(activity),
  })

  if (!response.ok) {
    throw new Error("Failed to add activity")
  }

  return response.json()
}

// Goals
export async function getGoals() {
  const response = await fetch("/api/goals")
  if (!response.ok) {
    throw new Error("Failed to fetch goals")
  }
  return response.json()
}

export async function addGoal(goal: any) {
  const response = await fetch("/api/goals", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(goal),
  })

  if (!response.ok) {
    throw new Error("Failed to add goal")
  }

  return response.json()
}

export async function updateGoalProgress(id: number, current: number) {
  const response = await fetch("/api/goals", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, current }),
  })

  if (!response.ok) {
    throw new Error("Failed to update goal progress")
  }

  return response.json()
}

// Nutrition
export async function getNutrition() {
  const response = await fetch("/api/nutrition")
  if (!response.ok) {
    throw new Error("Failed to fetch nutrition data")
  }
  return response.json()
}

export async function addNutritionEntry(entry: any) {
  const response = await fetch("/api/nutrition", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(entry),
  })

  if (!response.ok) {
    throw new Error("Failed to add nutrition entry")
  }

  return response.json()
}

// Workouts
export async function getWorkouts() {
  const response = await fetch("/api/workouts")
  if (!response.ok) {
    throw new Error("Failed to fetch workouts")
  }
  return response.json()
}

export async function addWorkout(workout: any) {
  const response = await fetch("/api/workouts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(workout),
  })

  if (!response.ok) {
    throw new Error("Failed to add workout")
  }

  return response.json()
}
