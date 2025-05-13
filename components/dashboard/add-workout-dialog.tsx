"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { addWorkout } from "@/lib/api"
import { toast } from "@/hooks/use-toast"

interface AddWorkoutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onWorkoutAdded?: () => void
}

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  weight: string;
}

export function AddWorkoutDialog({ open, onOpenChange, onWorkoutAdded }: AddWorkoutDialogProps) {
  const [date, setDate] = useState<Date>(new Date())
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [duration, setDuration] = useState("")
  const [difficulty, setDifficulty] = useState("Beginner")
  const [exercises, setExercises] = useState<Exercise[]>([
    { name: "", sets: 3, reps: "10", weight: "Body weight" }
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addExercise = () => {
    setExercises([...exercises, { name: "", sets: 3, reps: "10", weight: "Body weight" }])
  }

  const removeExercise = (index: number) => {
    if (exercises.length > 1) {
      setExercises(exercises.filter((_, i) => i !== index))
    }
  }

  const updateExercise = (index: number, field: keyof Exercise, value: string | number) => {
    const updatedExercises = [...exercises]
    updatedExercises[index] = { 
      ...updatedExercises[index], 
      [field]: value 
    }
    setExercises(updatedExercises)
  }

  const handleSubmit = async () => {
    try {
      // Validate form
      if (!name || !duration || exercises.some(e => !e.name)) {
        toast({
          title: "Missing required fields",
          description: "Please fill in all required fields",
          variant: "destructive"
        })
        return
      }

      setIsSubmitting(true)

      // Create workout object
      const workout = {
        name,
        description,
        duration,
        difficulty,
        exercises,
        scheduled: date.toISOString()
      }

      // Submit workout
      await addWorkout(workout)
      
      // Reset form and close dialog
      setName("")
      setDescription("")
      setDuration("")
      setDifficulty("Beginner")
      setExercises([{ name: "", sets: 3, reps: "10", weight: "Body weight" }])
      setDate(new Date())
      
      toast({
        title: "Workout created",
        description: "Your new workout has been added to your schedule"
      })
      
      // Call the callback to refresh workouts
      if (onWorkoutAdded) {
        onWorkoutAdded()
      }
      
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to create workout:", error)
      toast({
        title: "Failed to create workout",
        description: "There was an error creating your workout",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create New Workout</DialogTitle>
          <DialogDescription>
            Plan a new workout routine to add to your schedule.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="workout-name" className="text-right">
              Name
            </Label>
            <Input 
              id="workout-name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Upper Body Strength" 
              className="col-span-3" 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea 
              id="description" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Focus on chest, shoulders, and triceps" 
              className="col-span-3" 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="duration" className="text-right">
              Duration
            </Label>
            <Input 
              id="duration" 
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="45 min" 
              className="col-span-3" 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="difficulty" className="text-right">
              Difficulty
            </Label>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger id="difficulty" className="col-span-3">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn("col-span-3 justify-start text-left font-normal")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            <Label className="text-right pt-2">Exercises</Label>
            <div className="col-span-3 space-y-3">
              {exercises.map((exercise, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-center">
                  <Input 
                    placeholder="Exercise name" 
                    value={exercise.name}
                    onChange={(e) => updateExercise(index, "name", e.target.value)}
                    className="col-span-5" 
                  />
                  <Input 
                    type="number" 
                    placeholder="Sets" 
                    value={exercise.sets}
                    onChange={(e) => updateExercise(index, "sets", parseInt(e.target.value) || 0)}
                    className="col-span-2" 
                  />
                  <Input 
                    placeholder="Reps" 
                    value={exercise.reps}
                    onChange={(e) => updateExercise(index, "reps", e.target.value)}
                    className="col-span-2" 
                  />
                  <Input 
                    placeholder="Weight" 
                    value={exercise.weight}
                    onChange={(e) => updateExercise(index, "weight", e.target.value)}
                    className="col-span-2" 
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeExercise(index)}
                    disabled={exercises.length <= 1}
                    className="col-span-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addExercise} className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Add Exercise
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save workout"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// In the Dashboard component
{/* <AddWorkoutDialog 
  open={isAddWorkoutOpen} 
  onOpenChange={setIsAddWorkoutOpen}
  onWorkoutAdded={refreshWorkouts} 
/> */}




