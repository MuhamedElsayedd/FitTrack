"use client"

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

const activities = [
  {
    id: 1,
    type: "Running",
    duration: "30 min",
    distance: "5 km",
    calories: 320,
    date: "Today, 8:30 AM",
    icon: "🏃‍♂️",
  },
  {
    id: 2,
    type: "Cycling",
    duration: "45 min",
    distance: "15 km",
    calories: 420,
    date: "Today, 5:30 PM",
    icon: "🚴‍♀️",
  },
  {
    id: 3,
    type: "Swimming",
    duration: "40 min",
    distance: "1 km",
    calories: 350,
    date: "Yesterday, 7:00 AM",
    icon: "🏊‍♂️",
  },
  {
    id: 4,
    type: "Yoga",
    duration: "60 min",
    distance: null,
    calories: 180,
    date: "Yesterday, 6:30 PM",
    icon: "🧘‍♀️",
  },
  {
    id: 5,
    type: "Weight Training",
    duration: "50 min",
    distance: null,
    calories: 280,
    date: "2 days ago, 4:00 PM",
    icon: "🏋️‍♂️",
  },
  {
    id: 6,
    type: "Walking",
    duration: "35 min",
    distance: "3 km",
    calories: 150,
    date: "3 days ago, 12:30 PM",
    icon: "🚶‍♀️",
  },
]

interface RecentActivitiesProps {
  extended?: boolean
  date?: Date
  activityType?: string
}

export function RecentActivities({ extended = false, date, activityType }: RecentActivitiesProps) {
  const displayActivities = extended ? activities : activities.slice(0, 4)
  
  // Filter activities based on date and activityType if provided
  const filteredActivities = displayActivities.filter(activity => {
    let match = true;
    if (date) {
      // Simple date comparison - you might need more complex logic depending on your date format
      match = match && activity.date.includes(date.toISOString().split('T')[0]);
    }
    if (activityType) {
      match = match && activity.type.toLowerCase() === activityType.toLowerCase();
    }
    return match;
  });

  return (
    <div className="space-y-8">
      {filteredActivities.map((activity) => (
        <div key={activity.id} className="flex items-start">
          <Avatar className="h-9 w-9 mr-4">
            <AvatarImage src="" alt={activity.type} />
            <AvatarFallback className="text-lg">{activity.icon}</AvatarFallback>
          </Avatar>
          <div className="space-y-1 flex-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium leading-none">{activity.type}</p>
              <div className="flex items-center">
                <Badge variant="outline" className="mr-2">
                  {activity.calories} cal
                </Badge>
                {extended && (
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
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit activity
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete activity
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
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
              <span>{activity.date}</span>
            </div>
          </div>
        </div>
      ))}
      {!extended && activities.length > 4 && (
        <Button variant="outline" className="w-full">
          View all activities
        </Button>
      )}
    </div>
  )
}

