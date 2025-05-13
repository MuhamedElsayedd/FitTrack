"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Edit, Filter, MoreHorizontal, Search, Trash2 } from "lucide-react"
import { EditActivityDialog } from "@/components/dashboard/edit-activity-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

// Import the activities data
import { getActivities, deleteActivity } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

interface ViewAllActivitiesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onActivityDeleted?: () => void
}

interface Activity {
  _id: string
  type: string
  date: string
  duration: string
  distance: string | null
  calories: number
}

export function ViewAllActivitiesDialog({ 
  open, 
  onOpenChange,
  onActivityDeleted
}: ViewAllActivitiesDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activityType, setActivityType] = useState<string>("all")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  // Add state for edit activity dialog
  const [editActivityDialogOpen, setEditActivityDialogOpen] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const { toast } = useToast()

  // Fetch activities when dialog opens
  useEffect(() => {
    if (open) {
      fetchActivities()
    }
  }, [open])

  const fetchActivities = async () => {
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
  
  const handleDeleteActivity = async (id: string) => {
    if (confirm("Are you sure you want to delete this activity?")) {
      try {
        console.log("Deleting activity with ID:", id)
        await deleteActivity(id)
        
        toast({
          title: "Activity deleted",
          description: "The activity has been successfully deleted"
        })
        
        // Notify parent component
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

  // Add handler for editing activity
  const handleEditActivity = (activity: Activity) => {
    setSelectedActivity(activity)
    setEditActivityDialogOpen(true)
  }
  
  const filteredActivities = activities.filter((activity) => {
    let match = true;
    
    // Filter by date if selected
    if (date) {
      const activityDate = new Date(activity.date)
      match = match && (
        activityDate.getFullYear() === date.getFullYear() &&
        activityDate.getMonth() === date.getMonth() &&
        activityDate.getDate() === date.getDate()
      )
    }
    
    // Filter by activity type if selected (and not "all")
    if (activityType && activityType !== "all") {
      match = match && activity.type.toLowerCase() === activityType.toLowerCase()
    }
    
    // Filter by search query
    if (searchQuery) {
      match = match && activity.type.toLowerCase().includes(searchQuery.toLowerCase())
    }
    
    return match
  })

  // Clear all filters
  const clearFilters = () => {
    setDate(undefined)
    setActivityType("all")
    setSearchQuery("")
  }

  // Get activity icon based on type
  const getActivityIcon = (type: string): string => {
    const typeMap: Record<string, string> = {
      "Running": "🏃",
      "Cycling": "🚴",
      "Swimming": "🏊",
      "Yoga": "🧘",
      "Weight Training": "🏋️",
      "Walking": "🚶",
      "HIIT": "⚡",
    }
    return typeMap[type] || "🏆"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>All Activities</DialogTitle>
          <DialogDescription>View and manage all your fitness activities</DialogDescription>
        </DialogHeader>
        
        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search activities..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-10">
                  <Calendar className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            <Select value={activityType} onValueChange={setActivityType}>
              <SelectTrigger className="w-[130px] h-10">
                <SelectValue placeholder="Activity type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="Running">Running</SelectItem>
                <SelectItem value="Cycling">Cycling</SelectItem>
                <SelectItem value="Swimming">Swimming</SelectItem>
                <SelectItem value="Yoga">Yoga</SelectItem>
                <SelectItem value="Weight Training">Weight Training</SelectItem>
                <SelectItem value="Walking">Walking</SelectItem>
                <SelectItem value="HIIT">HIIT</SelectItem>
              </SelectContent>
            </Select>
            
            {(date || activityType || searchQuery) && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-10">
                Clear
              </Button>
            )}
          </div>
        </div>
        
        {/* Activities list */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading activities...
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No activities found matching your filters
            </div>
          ) : (
            filteredActivities.map((activity) => (
              <div key={activity._id} className="flex items-start border-b pb-4">
                <Avatar className="h-10 w-10 mr-4">
                  <AvatarImage src="" alt={activity.type} />
                  <AvatarFallback className="text-lg">{getActivityIcon(activity.type)}</AvatarFallback>
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
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleEditActivity(activity)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit activity
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDeleteActivity(activity._id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete activity
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />
                    <span className="mr-2">{activity.duration}</span>
                    {activity.distance && (
                      <>
                        <span className="mr-2">•</span>
                        <span>{activity.distance}</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <Calendar className="mr-1 h-3 w-3" />
                    <span>{new Date(activity.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Footer with action buttons */}
        <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </div>
        
        {/* Add EditActivityDialog */}
        {selectedActivity && (
          <EditActivityDialog
            open={editActivityDialogOpen}
            onOpenChange={setEditActivityDialogOpen}
            activity={selectedActivity}
            onActivityUpdated={onActivityDeleted || refreshActivities}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}













