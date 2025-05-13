"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/dashboard/overview"
import { RecentActivities } from "@/components/dashboard/recent-activities"
import { Button } from "@/components/ui/button"
import { 
  CalendarIcon, 
  LayoutDashboard, 
  LineChart, 
  ListChecks, 
  LogOut, 
  Plus, 
  Settings, 
  Utensils, 
  X 
} from "lucide-react"
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
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { AddWorkoutDialog } from "@/components/dashboard/add-workout-dialog"
import { AddMealDialog } from "@/components/dashboard/add-meal-dialog"
import { WorkoutSession } from "@/components/dashboard/workout-session"
import { useRouter } from 'next/navigation';
import { toast } from "@/components/ui/use-toast";
import { deleteAccount, updateUserProfile, updateUserPreferences, changePassword, getUserProfile } from "@/lib/api";
import { DeleteAccountDialog } from "@/components/dashboard/delete-account-dialog";

export default function Dashboard() {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")
  const router = useRouter();

  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [activityType, setActivityType] = useState<string | undefined>(undefined)
  const [isAddWorkoutOpen, setIsAddWorkoutOpen] = useState(false)
  // Add state for the AddMealDialog
  const [isAddMealOpen, setIsAddMealOpen] = useState(false)
  const [mealDate, setMealDate] = useState<Date>(new Date())
  const [mealType, setMealType] = useState<string | undefined>(undefined)
  // Add this state to track when activities should refresh
  const [activitiesKey, setActivitiesKey] = useState(0)
  const [activitiesRefreshTrigger, setActivitiesRefreshTrigger] = useState(0)
  const [nutritionRefreshTrigger, setNutritionRefreshTrigger] = useState(0)
  const [workoutsRefreshTrigger, setWorkoutsRefreshTrigger] = useState(0)
  const [activeWorkout, setActiveWorkout] = useState<any | null>(null)

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [units, setUnits] = useState("metric");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleLogout = () => {
    // Remove the auth token from localStorage
    localStorage.removeItem('auth-token');
    
    // Remove the auth cookie
    document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    
    // Redirect to home page
    router.push('/');
  };

  const handleDeleteAccount = async () => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone and will delete all your data."
    );
    
    if (!confirmed) return;
    
    try {
      await deleteAccount();
      
      toast({
        title: "Account deleted",
        description: "Your account has been successfully deleted"
      });
      
      // Clear auth token and redirect to home page
      document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict";
      localStorage.removeItem('auth-token');
      
      // Redirect to home page
      window.location.href = '/';
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete account",
        variant: "destructive"
      });
    }
  };

  // Set active tab based on URL parameter
  useEffect(() => {
    if (tabParam && ["overview", "activities", "nutrition", "workouts"].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [tabParam])

  const clearFilters = () => {
    setDate(undefined)
    setActivityType(undefined)
  }

  // Function to trigger activities refresh
  const refreshActivities = () => {
    setActivitiesKey(prevKey => prevKey + 1)
    setActivitiesRefreshTrigger(prev => prev + 1)
  }

  // Function to refresh nutrition entries
  const refreshNutrition = () => {
    setNutritionRefreshTrigger(prev => prev + 1)
  }

  // Function to refresh workouts
  const refreshWorkouts = () => {
    setWorkoutsRefreshTrigger(prev => prev + 1)
  }

  // Handle start workout
  const handleStartWorkout = (workout: any) => {
    setActiveWorkout(workout)
  }

  // Handle complete workout
  const handleCompleteWorkout = () => {
    setActiveWorkout(null)
    refreshWorkouts()
  }

  // Handle cancel workout
  const handleCancelWorkout = () => {
    if (confirm("Are you sure you want to cancel this workout? Your progress will be lost.")) {
      setActiveWorkout(null)
    }
  }

  useEffect(() => {
    // Fetch user profile data when component mounts
    const fetchUserProfile = async () => {
      try {
        const userData = await getUserProfile();
        if (userData) {
          setName(userData.name || "");
          setEmail(userData.email || "");
          setEmailNotifications(userData.preferences?.emailNotifications ?? true);
          setWeeklyReports(userData.preferences?.weeklyReports ?? true);
          setUnits(userData.preferences?.units || "metric");
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        toast({
          title: "Error",
          description: "Failed to load user profile",
          variant: "destructive"
        });
      }
    };

    fetchUserProfile();
  }, []);

  const handleSaveChanges = async () => {
    setIsUpdatingProfile(true);
    try {
      // Update profile information
      await updateUserProfile({ name, email });
      
      // Update preferences
      await updateUserPreferences({
        emailNotifications,
        weeklyReports,
        units
      });
      
      toast({
        title: "Settings updated",
        description: "Your profile and preferences have been updated successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update settings",
        variant: "destructive"
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    // Validate passwords
    if (!newPassword) {
      toast({
        title: "Error",
        description: "Please enter a new password",
        variant: "destructive"
      });
      return;
    }
    
    if (newPassword !== confirmNewPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }
    
    setIsUpdatingPassword(true);
    try {
      await changePassword({ newPassword });
      
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully"
      });
      
      // Clear password fields
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to change password",
        variant: "destructive"
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // Add these functions to handle nutrition-related actions
  const handleMealAdded = () => {
    // Refresh nutrition data when a meal is added
    setNutritionRefreshTrigger(prev => prev + 1);
    
    // Show success toast
    toast({
      title: "Meal added",
      description: "Your meal has been recorded successfully"
    });
  }

  const handleMealDeleted = () => {
    // Refresh nutrition data when a meal is deleted
    setNutritionRefreshTrigger(prev => prev + 1);
    
    // Show success toast
    toast({
      title: "Meal deleted",
      description: "Your meal has been removed successfully"
    });
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar className="border-r" variant="sidebar" collapsible="icon">
          <div className="flex h-16 items-center border-b px-4">
            <img 
              src="/favicon.png" 
              alt="FitTrack Logo" 
              className="h-6 w-6 mr-2" 
            />
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
          
          {/* Add a spacer to push the settings button to the bottom */}
          <div className="flex-1"></div>
          
          {/* Settings and logout buttons at the bottom */}
          <div className="px-3 py-4 border-t">
            <SidebarMenuButton 
              isActive={activeTab === "settings"} 
              onClick={() => setActiveTab("settings")}
              tooltip="Settings"
            >
              <Settings className="h-5 w-5 mr-2" />
              <span>Settings</span>
            </SidebarMenuButton>
            
            <SidebarMenuButton 
              onClick={handleLogout}
              tooltip="Log Out"
              className="mt-2 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
            >
              <LogOut className="h-5 w-5 mr-2" />
              <span>Log Out</span>
            </SidebarMenuButton>
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
                      <CardDescription>You have New Activities this week</CardDescription>
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
                      key={activitiesKey} 
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="nutrition" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Nutrition Tracker</CardTitle>
                        <CardDescription>Track your daily nutrition and calorie intake</CardDescription>
                      </div>
                      <Button size="sm" onClick={() => setIsAddMealOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Add Meal
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <NutritionTracker 
                      refreshTrigger={nutritionRefreshTrigger} 
                      onMealDeleted={handleMealDeleted}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="workouts" className="space-y-4">
                {activeWorkout ? (
                  <WorkoutSession
                    workout={activeWorkout}
                    onComplete={handleCompleteWorkout}
                    onCancel={handleCancelWorkout}
                  />
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Workout Planner</CardTitle>
                      <CardDescription>Schedule and track your workout routines</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                        </div>
                        <Button size="sm" onClick={() => setIsAddWorkoutOpen(true)}>
                          <Plus className="mr-2 h-4 w-4" /> Add Workout
                        </Button>
                      </div>
                      <WorkoutPlanner 
                        refreshTrigger={workoutsRefreshTrigger} 
                        onWorkoutDeleted={refreshWorkouts}
                        onStartWorkout={handleStartWorkout}
                      />
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Settings</CardTitle>
                    <CardDescription>Manage your account and application preferences</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      {/* Profile Section */}
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-medium">Profile</h3>
                          <p className="text-sm text-muted-foreground">
                            Manage your profile information and preferences
                          </p>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input 
                              id="name" 
                              className="max-w-md"
                              placeholder="Your name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                            />
                          </div>
                          
                          <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input 
                              id="email" 
                              type="email"
                              className="max-w-md"
                              placeholder="Your email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Preferences Section */}
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-medium">Preferences</h3>
                          <p className="text-sm text-muted-foreground">
                            Customize your dashboard experience
                          </p>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="emailNotifications" 
                              checked={emailNotifications}
                              onCheckedChange={(checked) => setEmailNotifications(checked as boolean)}
                            />
                            <Label htmlFor="emailNotifications">Email notifications</Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="weeklyReports" 
                              checked={weeklyReports}
                              onCheckedChange={(checked) => setWeeklyReports(checked as boolean)}
                            />
                            <Label htmlFor="weeklyReports">Weekly progress reports</Label>
                          </div>
                          
                          <div className="grid gap-2">
                            <Label htmlFor="units">Units</Label>
                            <Select value={units} onValueChange={setUnits}>
                              <SelectTrigger className="max-w-md">
                                <SelectValue placeholder="Select units" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="metric">Metric (kg, km)</SelectItem>
                                <SelectItem value="imperial">Imperial (lb, mi)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      {/* Account Section */}
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-medium">Account</h3>
                          <p className="text-sm text-muted-foreground">
                            Manage your account settings
                          </p>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="grid gap-2">
                            <Label htmlFor="new-password">Change Password</Label>
                            <div className="flex flex-col space-y-2 max-w-md">
                              <Input 
                                id="new-password" 
                                type="password"
                                placeholder="New password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                              />
                              <Input 
                                id="confirm-password" 
                                type="password"
                                placeholder="Confirm new password"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                              />
                              <Button 
                                variant="outline" 
                                onClick={handleChangePassword}
                                disabled={isUpdatingPassword}
                                className="self-start mt-1"
                              >
                                {isUpdatingPassword ? "Updating..." : "Update Password"}
                              </Button>
                            </div>
                          </div>
                          
                          <div className="pt-4">
                            <DeleteAccountDialog />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center pt-4 border-t">
                        <Button 
                          onClick={handleSaveChanges}
                          disabled={isUpdatingProfile}
                          className="mr-4"
                        >
                          {isUpdatingProfile ? "Saving..." : "Save Changes"}
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={handleLogout}
                        >
                          Log Out
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          <AddActivityDialog 
            open={isAddActivityOpen} 
            onOpenChange={setIsAddActivityOpen} 
            onActivityAdded={refreshActivities}
          />
          <AddWorkoutDialog open={isAddWorkoutOpen} onOpenChange={setIsAddWorkoutOpen} />
          <AddMealDialog 
            open={isAddMealOpen} 
            onOpenChange={setIsAddMealOpen} 
            onMealAdded={handleMealAdded}
          />
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}










