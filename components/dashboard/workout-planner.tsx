"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Dumbbell, MoreHorizontal, Play, Plus } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
    scheduled: "Tomorrow, 6:00 AM",
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
    scheduled: "Thursday, 5:30 PM",
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
    scheduled: "Saturday, 9:00 AM",
  },
]

export function WorkoutPlanner() {
  return (
    <Tabs defaultValue="upcoming">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
        <TabsTrigger value="routines">Routines</TabsTrigger>
      </TabsList>
      <TabsContent value="upcoming" className="space-y-4 mt-4">
        {workouts.map((workout) => (
          <Card key={workout.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{workout.name}</CardTitle>
                  <CardDescription>{workout.description}</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Edit workout</DropdownMenuItem>
                    <DropdownMenuItem>Reschedule</DropdownMenuItem>
                    <DropdownMenuItem>Mark as complete</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Cancel workout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground mb-4">
                <Clock className="mr-1 h-4 w-4" />
                <span className="mr-3">{workout.duration}</span>
                <Dumbbell className="mr-1 h-4 w-4" />
                <span>{workout.difficulty}</span>
              </div>
              <div className="flex items-center text-sm mb-4">
                <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                <span>{workout.scheduled}</span>
              </div>
              <div className="space-y-1">
                {workout.exercises.slice(0, 3).map((exercise, index) => (
                  <div key={index} className="text-sm flex justify-between">
                    <span>{exercise.name}</span>
                    <span className="text-muted-foreground">
                      {exercise.sets} sets × {exercise.reps}
                    </span>
                  </div>
                ))}
                {workout.exercises.length > 3 && (
                  <div className="text-sm text-muted-foreground">+{workout.exercises.length - 3} more exercises</div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Play className="mr-2 h-4 w-4" /> Start Workout
              </Button>
            </CardFooter>
          </Card>
        ))}
      </TabsContent>
      <TabsContent value="history" className="space-y-4 mt-4">
        <div className="space-y-4">
          <div className="text-sm font-medium">This Week</div>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <div>
                  <CardTitle>Upper Body Strength</CardTitle>
                  <CardDescription>Monday, 6:00 AM</CardDescription>
                </div>
                <Badge>Completed</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground mb-2">
                <Clock className="mr-1 h-4 w-4" />
                <span className="mr-3">45 min</span>
                <Dumbbell className="mr-1 h-4 w-4" />
                <span>Intermediate</span>
              </div>
              <div className="text-sm">
                <span className="font-medium">Performance: </span>
                <span className="text-muted-foreground">Increased weight on bench press by 5 lbs</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <div>
                  <CardTitle>Cardio Session</CardTitle>
                  <CardDescription>Sunday, 8:30 AM</CardDescription>
                </div>
                <Badge>Completed</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground mb-2">
                <Clock className="mr-1 h-4 w-4" />
                <span className="mr-3">30 min</span>
                <Dumbbell className="mr-1 h-4 w-4" />
                <span>Moderate</span>
              </div>
              <div className="text-sm">
                <span className="font-medium">Performance: </span>
                <span className="text-muted-foreground">5K run at 5:30 min/km pace</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      <TabsContent value="routines" className="space-y-4 mt-4">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm font-medium">My Routines</div>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" /> Create Routine
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Upper Body Strength</CardTitle>
              <CardDescription>6 exercises · 45 min</CardDescription>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <div>Bench Press: 4 × 8-10</div>
              <div>Overhead Press: 3 × 10-12</div>
              <div>Incline Dumbbell Press: 3 × 10-12</div>
              <div className="text-muted-foreground">+3 more</div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm">
                Edit
              </Button>
              <Button size="sm">Schedule</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Lower Body Power</CardTitle>
              <CardDescription>6 exercises · 50 min</CardDescription>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <div>Barbell Squats: 5 × 5</div>
              <div>Romanian Deadlifts: 3 × 8-10</div>
              <div>Walking Lunges: 3 × 10 each leg</div>
              <div className="text-muted-foreground">+3 more</div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm">
                Edit
              </Button>
              <Button size="sm">Schedule</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Full Body HIIT</CardTitle>
              <CardDescription>6 exercises · 30 min</CardDescription>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <div>Burpees: 4 × 45 seconds</div>
              <div>Mountain Climbers: 4 × 45 seconds</div>
              <div>Kettlebell Swings: 4 × 45 seconds</div>
              <div className="text-muted-foreground">+3 more</div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm">
                Edit
              </Button>
              <Button size="sm">Schedule</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Core Strength</CardTitle>
              <CardDescription>5 exercises · 20 min</CardDescription>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <div>Plank: 3 × 60 seconds</div>
              <div>Russian Twists: 3 × 20 reps</div>
              <div>Bicycle Crunches: 3 × 20 reps</div>
              <div className="text-muted-foreground">+2 more</div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm">
                Edit
              </Button>
              <Button size="sm">Schedule</Button>
            </CardFooter>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  )
}
