"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/dashboard/overview"
import { RecentActivities } from "@/components/dashboard/recent-activities"
import { Button } from "@/components/ui/button"
import { CalendarIcon, LayoutDashboard, LineChart, ListChecks, Plus, Utensils, X } from "lucide-react"
import { GoalProgress } from "@/components/dashboard/goal-progress"
import { ActivitySummary } from "@/components/dashboard/activity-summary"
import { NutritionTracker } from "@/components/dashboard/nutrition-tracker"
import { WorkoutPlanner } from "@/components/dashboard/workout-planner"
import { AddActivityDialog } from "@/components/dashboard/add-activity-dialog"
import { SidebarProvider, Sidebar, SidebarMenuButton, SidebarInset } from "@/components/ui/sidebar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"

export default function Dashboard() {
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [activityType, setActivityType] = useState<string | undefined>(undefined)

  const clearFilters = () => {
    setDate(undefined)
    setActivityType(undefined)
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar className="border-r" variant="sidebar" collapsible="icon">
          <div className="flex h-16 items-center border-b px-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 mr-2"
            >
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
              <path d="M7 14.5s0 .5 1.5.5 2-1 3.5-1 2.5 1 3.5 1 1.5-.5 1.5-.5" />
              <path d="M7 9.5s0 .5 1.5.5 2-1 3.5-1 2.5 1 3.5 1 1.5-.5 1.5-.5" />
            </svg>
            <span className="font-bold">FitTrack</span>
          </div>
          <div className="px-3 py-4">
            <div className="space-y-1">
              <SidebarMenuButton 
                isActive={activeTab === "overview"} 
                onClick={() => setActiveTab("overview")}
                tooltip="Overview"
              >
                <LayoutDashboard className="h-5 w-5 mr-2" />
                <span>Overview</span>
              </SidebarMenuButton>
              <SidebarMenuButton 
                isActive={activeTab === "activities"} 
                onClick={() => setActiveTab("activities")}
                tooltip="Activities"
              >
                <LineChart className="h-5 w-5 mr-2" />
                <span>Activities</span>
              </SidebarMenuButton>
              <SidebarMenuButton 
                isActive={activeTab === "nutrition"} 
                onClick={() => setActiveTab("nutrition")}
                tooltip="Nutrition"
              >
                <Utensils className="h-5 w-5 mr-2" />
                <span>Nutrition</span>
              </SidebarMenuButton>
              <SidebarMenuButton 
                isActive={activeTab === "workouts"} 
                onClick={() => setActiveTab("workouts")}
                tooltip="Workouts"
              >
                <ListChecks className="h-5 w-5 mr-2" />
                <span>Workouts</span>
              </SidebarMenuButton>
            </div>
          </div>
        </Sidebar>
        <SidebarInset className="flex-1 overflow-auto">
          <div className="w-full p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 w-full">
              <TabsContent value="overview" className="space-y-4 w-full">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                  <p className="text-muted-foreground">Track your fitness journey and achieve your goals.</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Daily Steps</CardTitle>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-muted-foreground"
                      >
                        <path d="M16 18V6m-8 6v6M8 6v4" />
                      </svg>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">8,249</div>
                      <p className="text-xs text-muted-foreground">+20.1% from yesterday</p>
                      <div className="mt-4 h-1 w-full bg-secondary">
                        <div className="h-1 w-[75%] bg-primary"></div>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">75% of daily goal</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Calories Burned</CardTitle>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-muted-foreground"
                      >
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">487</div>
                      <p className="text-xs text-muted-foreground">+10.5% from yesterday</p>
                      <div className="mt-4 h-1 w-full bg-secondary">
                        <div className="h-1 w-[60%] bg-primary"></div>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">60% of daily goal</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Minutes</CardTitle>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-muted-foreground"
                      >
                        <rect width="20" height="14" x="2" y="5" rx="2" />
                        <path d="M2 10h20" />
                      </svg>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">42</div>
                      <p className="text-xs text-muted-foreground">+12.5% from yesterday</p>
                      <div className="mt-4 h-1 w-full bg-secondary">
                        <div className="h-1 w-[70%] bg-primary"></div>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">70% of daily goal</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Water Intake</CardTitle>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-muted-foreground"
                      >
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                      </svg>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">1.8L</div>
                      <p className="text-xs text-muted-foreground">+5.2% from yesterday</p>
                      <div className="mt-4 h-1 w-full bg-secondary">
                        <div className="h-1 w-[45%] bg-primary"></div>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">45% of daily goal</p>
                    </CardContent>
                  </Card>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                  <Card className="col-span-4">
                    <CardHeader>
                      <CardTitle>Activity Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                      <Overview />
                    </CardContent>
                  </Card>
                  <Card className="col-span-3">
                    <CardHeader>
                      <CardTitle>Goal Progress</CardTitle>
                      <CardDescription>Your progress towards fitness goals</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <GoalProgress />
                    </CardContent>
                  </Card>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                  <Card className="col-span-3">
                    <CardHeader>
                      <CardTitle>Recent Activities</CardTitle>
                      <CardDescription>You completed 6 activities this week</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <RecentActivities />
                    </CardContent>
                  </Card>
                  <Card className="col-span-4">
                    <CardHeader>
                      <CardTitle>Weekly Summary</CardTitle>
                      <CardDescription>Your activity breakdown for the past week</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ActivitySummary />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="activities" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Activity History</CardTitle>
                        <CardDescription>View and manage your recent activities</CardDescription>
                      </div>
                      <Button onClick={() => setIsAddActivityOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Add Activity
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="sm">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {date ? format(date, "PPP") : "Filter by date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={setDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        
                        <Select value={activityType} onValueChange={setActivityType}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Activity type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="running">Running</SelectItem>
                            <SelectItem value="cycling">Cycling</SelectItem>
                            <SelectItem value="swimming">Swimming</SelectItem>
                            <SelectItem value="yoga">Yoga</SelectItem>
                            <SelectItem value="weight-training">Weight Training</SelectItem>
                            <SelectItem value="walking">Walking</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        {(date || activityType) && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={clearFilters}
                            className="h-8 px-2"
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Clear filters</span>
                          </Button>
                        )}
                      </div>
                      
                      {(date || activityType) && (
                        <div className="flex gap-2">
                          {date && (
                            <Badge variant="secondary" className="rounded-sm">
                              Date: {format(date, "PP")}
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setDate(undefined)} 
                                className="h-4 w-4 p-0 ml-1"
                              >
                                <X className="h-3 w-3" />
                                <span className="sr-only">Remove date filter</span>
                              </Button>
                            </Badge>
                          )}
                          {activityType && (
                            <Badge variant="secondary" className="rounded-sm capitalize">
                              Type: {activityType}
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setActivityType(undefined)} 
                                className="h-4 w-4 p-0 ml-1"
                              >
                                <X className="h-3 w-3" />
                                <span className="sr-only">Remove type filter</span>
                              </Button>
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    <RecentActivities 
                      extended={true} 
                      date={date} 
                      activityType={activityType} 
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="nutrition" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Nutrition Tracker</CardTitle>
                    <CardDescription>Track your daily nutrition and calorie intake</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          Today
                        </Button>
                        <Button variant="outline" size="sm">
                          <Utensils className="mr-2 h-4 w-4" />
                          Meal type
                        </Button>
                      </div>
                      <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" /> Add Meal
                      </Button>
                    </div>
                    <NutritionTracker />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="workouts" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Workout Planner</CardTitle>
                    <CardDescription>Plan and track your workout routines</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          Schedule
                        </Button>
                        <Button variant="outline" size="sm">
                          <ListChecks className="mr-2 h-4 w-4" />
                          Routines
                        </Button>
                      </div>
                      <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" /> New Workout
                      </Button>
                    </div>
                    <WorkoutPlanner />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          <AddActivityDialog open={isAddActivityOpen} onOpenChange={setIsAddActivityOpen} />
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}





