"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dumbbell, Calendar, Clock, ChevronRight, Trash2 } from "lucide-react"
import { getWorkouts, deleteWorkout } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { format, parseISO, isToday, isTomorrow, addDays } from "date-fns"

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

interface WorkoutListProps {
  refreshTrigger?: number
  onWorkoutDeleted?: () => void
  onStartWorkout?: (workout: Workout) => void
}

export function WorkoutList({ refreshTrigger = 0, onWorkoutDeleted, onStartWorkout }: WorkoutListProps) {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  
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
  
  // Handle delete workout
  const handleDeleteWorkout = async (id: string, event: React.MouseEvent) => {
    event.stopPropagation()
    
    if (confirm("Are you sure you want to delete this workout?")) {
      try {
        await deleteWorkout(id)
        
        toast({
          title: "Workout deleted",
          description: "The workout has been successfully deleted"
        })
        
        // Remove the deleted workout from the state
        setWorkouts(workouts.filter(workout => workout._id !== id))
        
        // Notify parent component
        if (onWorkoutDeleted) {
          onWorkoutDeleted()
        }
      } catch (error) {
        console.error("Failed to delete workout:", error)
        toast({
          title: "Error",
          description: "Failed to delete workout",
          variant: "destructive"
        })
      }
    }
  }
  
  // Handle start workout
  const handleStartWorkout = (workout: Workout) => {
    if (onStartWorkout) {
      onStartWorkout(workout)
    }
  }
  
  return (
    <div className="space-y-4">
      {loading ? (
        <div className="text-center py-8">Loading workouts...</div>
      ) : workouts.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No workouts scheduled. Create your first workout to get started.
        </div>
      ) : (
        workouts.map((workout) => (
          <Card 
            key={workout._id} 
            className="cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => handleStartWorkout(workout)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Dumbbell className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{workout.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">{workout.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 h-4 w-4" />
                        {workout.duration}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-1 h-4 w-4" />
                        {formatScheduledDate(workout.scheduled)}
                      </div>
                      <Badge className={`${getDifficultyColor(workout.difficulty)}`}>
                        {workout.difficulty}
                      </Badge>
                    </div>
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground">
                        {workout.exercises.length} exercises
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={(e) => handleDeleteWorkout(workout._id, e)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}