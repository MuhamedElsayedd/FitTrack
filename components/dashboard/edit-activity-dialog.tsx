"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { updateActivity } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

interface Activity {
  _id: string
  type: string
  duration: string
  distance: string | null
  calories: number
  date: string
}

interface EditActivityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  activity: Activity
  onActivityUpdated?: () => void
}

export function EditActivityDialog({ 
  open, 
  onOpenChange,
  activity,
  onActivityUpdated
}: EditActivityDialogProps) {
  // Parse duration from "X minutes/hours" format
  const parseDuration = (durationStr: string) => {
    const parts = durationStr.split(' ')
    return {
      value: parts[0],
      unit: parts[1] || 'minutes'
    }
  }
  
  // Parse distance from "X km/mi" format
  const parseDistance = (distanceStr: string | null) => {
    if (!distanceStr) return { value: '', unit: 'km' }
    const parts = distanceStr.split(' ')
    return {
      value: parts[0],
      unit: parts[1] || 'km'
    }
  }
  
  const initialDuration = parseDuration(activity.duration)
  const initialDistance = parseDistance(activity.distance)
  
  const [activityType, setActivityType] = useState(activity.type)
  const [duration, setDuration] = useState(initialDuration.value)
  const [durationUnit, setDurationUnit] = useState(initialDuration.unit)
  const [distance, setDistance] = useState(initialDistance.value)
  const [distanceUnit, setDistanceUnit] = useState(initialDistance.unit)
  const [calories, setCalories] = useState(activity.calories.toString())
  const [date, setDate] = useState<Date>(new Date(activity.date))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Update form when activity changes
  useEffect(() => {
    if (activity) {
      setActivityType(activity.type)
      
      const durationParts = parseDuration(activity.duration)
      setDuration(durationParts.value)
      setDurationUnit(durationParts.unit)
      
      const distanceParts = parseDistance(activity.distance)
      setDistance(distanceParts.value)
      setDistanceUnit(distanceParts.unit)
      
      setCalories(activity.calories.toString())
      setDate(new Date(activity.date))
    }
  }, [activity])

  const handleSubmit = async () => {
    if (!activityType || !duration || !calories) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Format duration with unit
      const formattedDuration = `${duration} ${durationUnit}`
      
      // Format distance with unit if provided
      const formattedDistance = distance ? `${distance} ${distanceUnit}` : null

      const updatedActivity = {
        type: activityType,
        duration: formattedDuration,
        distance: formattedDistance,
        calories: parseInt(calories),
        date: date.toISOString()
      }

      console.log("Submitting updated activity:", activity._id, updatedActivity)
      
      await updateActivity(activity._id, updatedActivity)
      
      toast({
        title: "Activity updated",
        description: "Your activity has been updated successfully"
      })
      
      // Call the callback to refresh activities
      if (onActivityUpdated) {
        onActivityUpdated()
      }
      
      // Close the dialog
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to update activity:", error)
      toast({
        title: "Error",
        description: "Failed to update activity",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Activity</DialogTitle>
          <DialogDescription>Update your fitness activity details.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="activity-type" className="text-right">
              Type
            </Label>
            <Select value={activityType} onValueChange={setActivityType}>
              <SelectTrigger id="activity-type" className="col-span-3">
                <SelectValue placeholder="Select activity type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Running">Running</SelectItem>
                <SelectItem value="Cycling">Cycling</SelectItem>
                <SelectItem value="Swimming">Swimming</SelectItem>
                <SelectItem value="Yoga">Yoga</SelectItem>
                <SelectItem value="Weight Training">Weight Training</SelectItem>
                <SelectItem value="Walking">Walking</SelectItem>
                <SelectItem value="HIIT">HIIT</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="duration" className="text-right">
              Duration
            </Label>
            <Input
              id="duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="col-span-2"
            />
            <Select value={durationUnit} onValueChange={setDurationUnit}>
              <SelectTrigger id="duration-unit">
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minutes">minutes</SelectItem>
                <SelectItem value="hours">hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="distance" className="text-right">
              Distance
            </Label>
            <Input
              id="distance"
              type="number"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              className="col-span-2"
            />
            <Select value={distanceUnit} onValueChange={setDistanceUnit}>
              <SelectTrigger id="distance-unit">
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="km">km</SelectItem>
                <SelectItem value="mi">mi</SelectItem>
                <SelectItem value="m">m</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="calories" className="text-right">
              Calories
            </Label>
            <Input
              id="calories"
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "col-span-3 justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Activity"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}


