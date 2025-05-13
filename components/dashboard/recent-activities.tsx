"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Edit, MoreHorizontal, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ViewAllActivitiesDialog } from "./view-all-activities-dialog"
import { getActivities, deleteActivity } from "@/lib/api"
import { format, parseISO } from "date-fns"
import { useToast } from "@/components/ui/use-toast"

// Add EditActivityDialog import
import { EditActivityDialog } from "@/components/dashboard/edit-activity-dialog"

interface Activity {
  _id: string
  type: string
  duration: string
  distance: string | null
  calories: number
  date: string
  userId: string
}

interface RecentActivitiesProps {
  extended?: boolean
  date?: Date
  activityType?: string
  refreshTrigger?: number
  onActivityDeleted?: () => void
}

// Map activity types to icons
const activityIcons: Record<string, string> = {
  "Running": "🏃‍♂️",
  "Cycling": "🚴‍♀️",
  "Swimming": "🏊‍♂️",
  "Yoga": "🧘‍♀️",
  "Weight Training": "🏋️‍♂️",
  "Walking": "🚶‍♀️",
  "HIIT": "⚡",
  "Other": "🏆"
}

export function RecentActivities({ 
  extended = false, 
  date, 
  activityType,
  refreshTrigger = 0,
  onActivityDeleted
}: RecentActivitiesProps) {
  const [viewAllDialogOpen, setViewAllDialogOpen] = useState(false)
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  
  // Add state for edit activity dialog
  const [editActivityDialogOpen, setEditActivityDialogOpen] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  
  // Handle edit activity
  const handleEditActivity = (activity: Activity) => {
    setSelectedActivity(activity)
    setEditActivityDialogOpen(true)
  }
  
  // Handle delete activity
  const handleDeleteActivity = async (id: string) => {
    if (confirm("Are you sure you want to delete this activity?")) {
      try {
        console.log("Deleting activity with ID:", id)
        await deleteActivity(id)
        
        toast({
          title: "Activity deleted",
          description: "The activity has been successfully deleted"
        })
        
        // Notify parent component if callback exists
        if (onActivityDeleted) {
          onActivityDeleted()
        } else {
          // If no callback, refresh locally
          refreshActivities()
        }
      } catch (error) {
        console.error("Failed to delete activity:", error)
        toast({
          title: "Error",
          description: "Failed to delete activity",
          variant: "destructive"
        })
      }
    }
  }
  
  // Add refreshActivities function
  const refreshActivities = async () => {
    try {
      setLoading(true)
      const data = await getActivities()
      setActivities(data)
    } catch (error) {
      console.error("Failed to fetch activities:", error)
      toast({
        title: "Error",
        description: "Failed to load activities",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }
  
  // Add refreshTrigger to the dependency array to refetch when it changes
  useEffect(() => {
    refreshActivities()
  }, [refreshTrigger])
  
  // Filter activities based on date and activityType if provided
  const filteredActivities = activities.filter(activity => {
    let match = true
    if (date) {
      const activityDate = parseISO(activity.date)
      match = match && (
        activityDate.getDate() === date.getDate() &&
        activityDate.getMonth() === date.getMonth() &&
        activityDate.getFullYear() === date.getFullYear()
      )
    }
    if (activityType) {
      match = match && activity.type.toLowerCase() === activityType.toLowerCase()
    }
    return match
  })

  // Limit the number of activities shown if not extended
  const displayActivities = extended ? filteredActivities : filteredActivities.slice(0, 4)

  // Format date for display
  const formatActivityDate = (dateString: string) => {
    const date = parseISO(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    if (date.toDateString() === today.toDateString()) {
      return `Today, ${format(date, 'h:mm a')}`
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${format(date, 'h:mm a')}`
    } else {
      return format(date, 'MMM d, yyyy, h:mm a')
    }
  }

  if (loading) {
    return <div className="py-4 text-center">Loading activities...</div>
  }

  if (displayActivities.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No activities found. Add your first activity to get started!
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {displayActivities.map((activity) => (
        <div key={activity._id} className="flex items-start">
          <Avatar className="h-9 w-9 mr-4">
            <AvatarImage src="" alt={activity.type} />
            <AvatarFallback className="text-lg">{activityIcons[activity.type] || "🏆"}</AvatarFallback>
          </Avatar>
          <div className="space-y-1 flex-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium leading-none">{activity.type}</p>
              <div className="flex items-center">
                <Badge variant="outline" className="mr-2">
                  {activity.calories} cal
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleEditActivity(activity)}>
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={() => handleDeleteActivity(activity._id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="flex items-center pt-1">
              <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{activity.duration}</span>
              {activity.distance && (
                <>
                  <span className="mx-1 text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{activity.distance}</span>
                </>
              )}
            </div>
            <div className="flex items-center pt-1">
              <Calendar className="mr-1 h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{formatActivityDate(activity.date)}</span>
            </div>
          </div>
        </div>
      ))}
      
      {!extended && activities.length > 4 && (
        <Button variant="outline" className="w-full" onClick={() => setViewAllDialogOpen(true)}>
          View All Activities
        </Button>
      )}
      
      <ViewAllActivitiesDialog 
        open={viewAllDialogOpen} 
        onOpenChange={setViewAllDialogOpen} 
        onActivityDeleted={onActivityDeleted || refreshActivities}
      />
      
      {selectedActivity && (
        <EditActivityDialog
          open={editActivityDialogOpen}
          onOpenChange={setEditActivityDialogOpen}
          activity={selectedActivity}
          onActivityUpdated={onActivityDeleted || refreshActivities}
        />
      )}
    </div>
  )
}








