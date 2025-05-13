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

export async function deleteActivity(id: string) {
  console.log("Deleting activity with ID:", id)
  
  const response = await fetch(`/api/activities/${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    console.error("Delete activity error:", response.status, errorData)
    throw new Error(errorData.error || "Failed to delete activity")
  }

  return response.json()
}

export async function updateActivity(id: string, activity: any) {
  console.log("Updating activity with ID:", id, activity)
  
  const response = await fetch(`/api/activities/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(activity),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    console.error("Update activity error:", response.status, errorData)
    throw new Error(errorData.error || "Failed to update activity")
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
    const errorData = await response.json().catch(() => ({}))
    console.error("Failed to add nutrition entry:", response.status, errorData)
    throw new Error(errorData.error || "Failed to add nutrition entry")
  }

  return response.json()
}

export async function deleteNutritionEntry(entryId: string) {
  const response = await fetch(`/api/nutrition/${entryId}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || "Failed to delete nutrition entry")
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

export async function deleteWorkout(id: string) {
  console.log("Deleting workout with ID:", id)
  
  const response = await fetch(`/api/workouts/${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    console.error("Delete workout error:", response.status, errorData)
    throw new Error(errorData.error || "Failed to delete workout")
  }

  return response.json()
}

// Authentication
export async function signup(userData: { name: string; email: string; password: string }) {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to sign up")
  }

  return response.json()
}

export async function login(credentials: { email: string; password: string }) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to log in")
  }

  return response.json()
}

export async function deleteAccount() {
  try {
    const response = await fetch('/api/auth/delete-account', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete account');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting account:', error);
    throw error;
  }
}

// User profile
export async function getUserProfile() {
  const response = await fetch("/api/user/profile")
  if (!response.ok) {
    throw new Error("Failed to fetch user profile")
  }
  return response.json()
}

export async function updateUserProfile(profileData: { name?: string; email?: string }) {
  const response = await fetch("/api/user/profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profileData),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || "Failed to update profile")
  }

  return response.json()
}

export async function updateUserPreferences(preferences: { 
  emailNotifications?: boolean; 
  weeklyReports?: boolean; 
  units?: string 
}) {
  const response = await fetch("/api/user/preferences", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(preferences),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || "Failed to update preferences")
  }

  return response.json()
}

export async function changePassword(data: { newPassword: string }) {
  const response = await fetch("/api/user/change-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || "Failed to change password")
  }

  return response.json()
}















