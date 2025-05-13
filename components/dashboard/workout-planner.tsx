"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Calendar, Clock, Dumbbell, MoreVertical, Play } from "lucide-react"
import { WorkoutSession } from "@/components/dashboard/workout-session"
import { getWorkouts, deleteWorkout } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { format, parseISO, isToday, isTomorrow, addDays } from "date-fns"

// Types
interface Exercise {
  name: string
  sets: number
  reps: string
  weight: string
}

interface Workout {
  _id: string
  name: string
  description: string
  duration: string
  difficulty: string
  exercises: Exercise[]
  scheduled: string
  userId: string
}

interface WorkoutPlannerProps {
  refreshTrigger?: number
  onWorkoutDeleted?: () => void
  onStartWorkout?: (workout: Workout) => void
}

export function WorkoutPlanner({ refreshTrigger = 0, onWorkoutDeleted, onStartWorkout: propOnStartWorkout }: WorkoutPlannerProps) {
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Format date to display
  const formatScheduledDate = (dateString: string) => {
    try {
      const date = parseISO(dateString)
      
      if (isToday(date)) {
        return 'Today, ' + format(date, 'h:mm a')
      } else if (isTomorrow(date)) {
        return 'Tomorrow, ' + format(date, 'h:mm a')
      } else if (date < addDays(new Date(), 7)) {
        return format(date, 'EEEE, h:mm a')
      } else {
        return format(date, 'MMM d, h:mm a')
      }
    } catch (error) {
      return 'Invalid date'
    }
  }

  // Get difficulty badge color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  // Fetch workouts
  const fetchWorkouts = async () => {
    try {
      setLoading(true)
      const data = await getWorkouts()
      setWorkouts(data)
    } catch (error) {
      console.error("Failed to fetch workouts:", error)
      toast({
        title: "Error",
        description: "Failed to load workouts",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }
  
  // Fetch workouts on mount and when refreshTrigger changes
  useEffect(() => {
    fetchWorkouts()
  }, [refreshTrigger])

  const handleStartWorkout = (workout: Workout) => {
    if (propOnStartWorkout) {
      propOnStartWorkout(workout);
    } else {
      setActiveWorkout(workout);
    }
  };

  const handleCompleteWorkout = () => {
    // Here you would typically save the workout results to your backend
    setActiveWorkout(null);
    fetchWorkouts(); // Refresh the workouts list
  };

  const handleCancelWorkout = () => {
    if (confirm("Are you sure you want to cancel this workout? Your progress will be lost.")) {
      setActiveWorkout(null);
    }
  };

  // Handle delete workout
  const handleDeleteWorkout = async (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (confirm("Are you sure you want to delete this workout?")) {
      try {
        await deleteWorkout(id);
        
        toast({
          title: "Workout deleted",
          description: "The workout has been successfully deleted"
        });
        
        // Remove the deleted workout from the state
        setWorkouts(workouts.filter(workout => workout._id !== id));
        
        // Notify parent component
        if (onWorkoutDeleted) {
          onWorkoutDeleted();
        }
      } catch (error) {
        console.error("Failed to delete workout:", error);
        toast({
          title: "Error",
          description: "Failed to delete workout",
          variant: "destructive"
        });
      }
    }
  };

  // If a workout is active, show the workout session
  if (activeWorkout) {
    return (
      <WorkoutSession
        workout={{...activeWorkout, id: Number(activeWorkout?._id)}}
        onComplete={handleCompleteWorkout}
        onCancel={handleCancelWorkout}
      />
    );
  }

  // Otherwise show the workout planner
  return (
    <Tabs defaultValue="upcoming">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
        <TabsTrigger value="routines">Routines</TabsTrigger>
      </TabsList>
      <TabsContent value="upcoming" className="space-y-4 mt-4">
        {loading ? (
          <div className="text-center py-8">Loading workouts...</div>
        ) : workouts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No workouts scheduled. Create your first workout to get started.
          </div>
        ) : (
          workouts.map((workout) => (
            <Card key={workout._id}>
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
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => handleDeleteWorkout(workout._id, e)}>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center space-x-4 mb-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-4 w-4" />
                    <span>{workout.duration}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Dumbbell className="mr-1 h-4 w-4" />
                    <span>{workout.difficulty}</span>
                  </div>
                </div>
                <div className="flex items-center text-sm mb-4">
                  <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                  <span>{formatScheduledDate(workout.scheduled)}</span>
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
                <Button className="w-full" onClick={() => handleStartWorkout(workout)}>
                  <Play className="mr-2 h-4 w-4" /> Start Workout
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
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
        <div className="text-sm font-medium">My Routines</div>
        <Card>
          <CardHeader>
            <CardTitle>Full Body HIIT</CardTitle>
            <CardDescription>10 exercises · 45 min</CardDescription>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            {/* Routine exercises... */}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm">
              Edit
            </Button>
            <Button size="sm">Schedule</Button>
          </CardFooter>
        </Card>
        {/* Other routine cards... */}
      </TabsContent>
    </Tabs>
  )
}



