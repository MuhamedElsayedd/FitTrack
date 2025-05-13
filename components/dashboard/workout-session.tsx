"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, CheckCircle, ChevronRight, Clock, Dumbbell, Pause, Play, RotateCcw, Timer, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

interface Exercise {
  name: string
  sets: number
  reps: string
  weight: string
  completed?: number
}

interface Workout {
  id: number
  name: string
  description: string
  duration: string
  difficulty: string
  exercises: Exercise[]
  scheduled: string
}

interface WorkoutSessionProps {
  workout: Workout
  onComplete: () => void
  onCancel: () => void
}

export function WorkoutSession({ workout, onComplete, onCancel }: WorkoutSessionProps) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [currentSetIndex, setCurrentSetIndex] = useState(0)
  const [isResting, setIsResting] = useState(false)
  const [restTime, setRestTime] = useState(60) // 60 seconds rest by default
  const [timer, setTimer] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(true)
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false)
  const [exercises, setExercises] = useState<Exercise[]>(
    workout.exercises.map(ex => ({ ...ex, completed: 0 }))
  )
  const { toast } = useToast()

  const currentExercise = exercises[currentExerciseIndex]
  const totalExercises = exercises.length
  const progress = Math.round(
    (exercises.reduce((acc, ex) => acc + (ex.completed || 0), 0) / 
    exercises.reduce((acc, ex) => acc + ex.sets, 0)) * 100
  )

  // Timer for workout duration
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  // Timer for rest periods
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isResting && restTime > 0) {
      interval = setInterval(() => {
        setRestTime(prevTime => {
          if (prevTime <= 1) {
            setIsResting(false);
            return 60; // Reset rest time for next rest period
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isResting, restTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCompleteSet = () => {
    const updatedExercises = [...exercises];
    updatedExercises[currentExerciseIndex].completed = 
      (updatedExercises[currentExerciseIndex].completed || 0) + 1;
    
    setExercises(updatedExercises);
    
    // Check if all sets of current exercise are completed
    if (currentSetIndex + 1 >= currentExercise.sets) {
      // Move to next exercise
      if (currentExerciseIndex + 1 < totalExercises) {
        setCurrentExerciseIndex(currentExerciseIndex + 1);
        setCurrentSetIndex(0);
        toast({
          title: "Exercise completed!",
          description: `Moving to ${exercises[currentExerciseIndex + 1].name}`,
        });
      } else {
        // Workout completed
        setIsCompleteDialogOpen(true);
      }
    } else {
      // Move to next set of current exercise
      setCurrentSetIndex(currentSetIndex + 1);
      setIsResting(true);
    }
  };

  const handleSkipRest = () => {
    setIsResting(false);
    setRestTime(60);
  };

  const handleCompleteWorkout = () => {
    onComplete();
    toast({
      title: "Workout completed!",
      description: "Great job! Your workout has been saved.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onCancel}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to workouts
        </Button>
        <div className="flex items-center">
          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>{formatTime(timer)}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="ml-2" 
            onClick={() => setIsTimerRunning(!isTimerRunning)}
          >
            {isTimerRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{workout.name}</CardTitle>
              <CardDescription>{workout.description}</CardDescription>
            </div>
            <Badge>{workout.difficulty}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-muted-foreground">{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>

            {isResting ? (
              <Card className="border-dashed bg-muted/50">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <h3 className="text-lg font-medium">Rest Time</h3>
                    <div className="text-3xl font-bold">{formatTime(restTime)}</div>
                    <p className="text-sm text-muted-foreground">
                      Next: Set {currentSetIndex + 1} of {currentExercise.sets} - {currentExercise.name}
                    </p>
                    <Button onClick={handleSkipRest}>Skip Rest</Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-2 border-primary">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {currentExercise.name}
                  </CardTitle>
                  <CardDescription>
                    Set {currentSetIndex + 1} of {currentExercise.sets}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-sm text-muted-foreground">Reps</div>
                      <div className="text-xl font-bold">{currentExercise.reps}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Weight</div>
                      <div className="text-xl font-bold">{currentExercise.weight}</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={handleCompleteSet}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Complete Set
                  </Button>
                </CardFooter>
              </Card>
            )}

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Up Next</h3>
              {exercises.map((exercise, index) => {
                // Skip already completed exercises and current exercise
                if (index < currentExerciseIndex) return null;
                if (index === currentExerciseIndex) return null;
                // Only show the next 2 exercises
                if (index > currentExerciseIndex + 2) return null;
                
                return (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-md"
                  >
                    <div className="flex items-center">
                      <div className="bg-muted w-6 h-6 rounded-full flex items-center justify-center mr-3">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{exercise.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {exercise.sets} sets × {exercise.reps}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isCompleteDialogOpen} onOpenChange={setIsCompleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Workout Complete!</DialogTitle>
            <DialogDescription>
              Congratulations on completing your workout. Would you like to save your progress?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center justify-between mb-4">
              <span>Duration</span>
              <span className="font-medium">{formatTime(timer)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Exercises Completed</span>
              <span className="font-medium">{totalExercises}</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onCancel}>
              Discard
            </Button>
            <Button onClick={handleCompleteWorkout}>
              Save Workout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}