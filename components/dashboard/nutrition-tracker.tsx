"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getNutrition, deleteNutritionEntry } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import { MoreHorizontal, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface NutritionEntry {
  _id: string
  meal: string
  time: string
  calories: number
  protein: number
  carbs: number
  fat: number
  items: {
    name: string
    calories: number
    protein: number
    carbs: number
    fat: number
  }[]
  date: string
  userId: string
}

interface NutritionTrackerProps {
  refreshTrigger?: number;
  onMealDeleted?: () => void;
}

export function NutritionTracker({ 
  refreshTrigger = 0,
  onMealDeleted
}: NutritionTrackerProps) {
  const [nutritionEntries, setNutritionEntries] = useState<NutritionEntry[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  
  // Get meal icon based on meal type
  const getMealIcon = (mealType: string) => {
    switch (mealType.toLowerCase()) {
      case 'breakfast':
        return '🍳'
      case 'lunch':
        return '🍲'
      case 'dinner':
        return '🍽️'
      case 'snack':
        return '🍌'
      default:
        return '🍴'
    }
  }
  
  // Format date to display
  const formatDate = (dateString: string) => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    const date = new Date(dateString)
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return format(date, 'MMM d, yyyy')
    }
  }
  
  // Fetch nutrition entries
  const fetchNutritionEntries = async () => {
    try {
      setLoading(true)
      const data = await getNutrition()
      setNutritionEntries(data)
    } catch (error) {
      console.error("Failed to fetch nutrition entries:", error)
      toast({
        title: "Error",
        description: "Failed to load nutrition data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }
  
  // Fetch nutrition entries on mount and when refreshTrigger changes
  useEffect(() => {
    fetchNutritionEntries()
  }, [refreshTrigger])
  
  // Update the calculateDailyTotals function to be more flexible
  const calculateDailyTotals = (date?: string) => {
    const targetDate = date || new Date().toISOString().split('T')[0]
    const dateEntries = nutritionEntries.filter(entry => entry.date === targetDate)
    
    return dateEntries.reduce(
      (totals, entry) => {
        return {
          calories: totals.calories + entry.calories,
          protein: totals.protein + entry.protein,
          carbs: totals.carbs + entry.carbs,
          fat: totals.fat + entry.fat
        }
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    )
  }

  // Calculate calorie goals based on user profile (this is a placeholder)
  // In a real app, this would come from user settings or be calculated based on user metrics
  const calculateCalorieGoal = () => {
    // Default goal
    return 2000
  }

  const dailyTotals = calculateDailyTotals()
  const calorieGoal = calculateCalorieGoal()
  const caloriePercentage = Math.min(100, (dailyTotals.calories / calorieGoal) * 100)
  
  // Group entries by date
  const entriesByDate = nutritionEntries.reduce((groups, entry) => {
    const date = entry.date
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(entry)
    return groups
  }, {} as Record<string, NutritionEntry[]>)

  // Calculate daily totals for each date group
  const getDailyTotalsForDate = (date: string) => {
    return calculateDailyTotals(date)
  }

  // Group entries by date and add daily totals
  const entriesByDateWithTotals = Object.entries(entriesByDate).map(([date, entries]) => {
    return {
      date,
      entries,
      totals: getDailyTotalsForDate(date)
    }
  })
  
  // Add this function to handle meal deletion
  const handleDeleteMeal = async (entryId: string) => {
    if (!confirm("Are you sure you want to delete this meal?")) {
      return;
    }
    
    try {
      await deleteNutritionEntry(entryId);
      
      // Remove the entry from state
      setNutritionEntries(prev => prev.filter(entry => entry._id !== entryId));
      
      // Update daily totals
      const today = new Date().toISOString().split('T')[0];
      const todayTotals = calculateDailyTotals(today);
      
      toast({
        title: "Meal deleted",
        description: "Your meal has been removed successfully"
      });
      
      // Call the callback if provided
      if (onMealDeleted) {
        onMealDeleted();
      }
    } catch (error) {
      console.error("Failed to delete meal:", error);
      toast({
        title: "Error",
        description: "Failed to delete meal",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Daily summary */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium">Daily Calories</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm">{dailyTotals.calories} / {calorieGoal} cal</span>
            <span className="text-xs text-muted-foreground">
              ({Math.round(caloriePercentage)}%)
            </span>
          </div>
        </div>
        <Progress value={caloriePercentage} className="h-2" />
        
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="flex flex-col items-center p-2 bg-muted rounded-md">
            <span className="text-xs text-muted-foreground">Protein</span>
            <span className="font-medium">{dailyTotals.protein}g</span>
            <span className="text-xs text-muted-foreground">
              {Math.round((dailyTotals.protein * 4 / dailyTotals.calories) * 100 || 0)}%
            </span>
          </div>
          <div className="flex flex-col items-center p-2 bg-muted rounded-md">
            <span className="text-xs text-muted-foreground">Carbs</span>
            <span className="font-medium">{dailyTotals.carbs}g</span>
            <span className="text-xs text-muted-foreground">
              {Math.round((dailyTotals.carbs * 4 / dailyTotals.calories) * 100 || 0)}%
            </span>
          </div>
          <div className="flex flex-col items-center p-2 bg-muted rounded-md">
            <span className="text-xs text-muted-foreground">Fat</span>
            <span className="font-medium">{dailyTotals.fat}g</span>
            <span className="text-xs text-muted-foreground">
              {Math.round((dailyTotals.fat * 9 / dailyTotals.calories) * 100 || 0)}%
            </span>
          </div>
        </div>
      </div>
      
      {/* Meal entries */}
      <Tabs defaultValue="all">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="breakfast">Breakfast</TabsTrigger>
          <TabsTrigger value="lunch">Lunch</TabsTrigger>
          <TabsTrigger value="dinner">Dinner</TabsTrigger>
          <TabsTrigger value="snack">Snack</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-6 mt-4">
          {loading ? (
            <div className="text-center py-4">Loading nutrition data...</div>
          ) : nutritionEntries.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No meals recorded yet. Add your first meal to start tracking.
            </div>
          ) : (
            entriesByDateWithTotals.map(({ date, entries, totals }) => (
              <div key={date} className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">{formatDate(date)}</h3>
                  <div className="text-xs text-muted-foreground">
                    {totals.calories} cal | P: {totals.protein}g | C: {totals.carbs}g | F: {totals.fat}g
                  </div>
                </div>
                
                {entries.map((entry) => (
                  <div key={entry._id} className="space-y-3">
                    <div className="flex items-start">
                      <Avatar className="h-9 w-9 mr-4">
                        <AvatarImage src="" alt={entry.meal} />
                        <AvatarFallback className="text-lg">{getMealIcon(entry.meal)}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium leading-none">{entry.meal}</p>
                          <div className="flex items-center">
                            <Badge variant="outline" className="mr-2">{entry.calories} cal</Badge>
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
                                <DropdownMenuItem 
                                  className="text-destructive"
                                  onClick={() => handleDeleteMeal(entry._id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete meal
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">{entry.time}</p>
                      </div>
                    </div>
                    
                    <div className="pl-12 space-y-1">
                      {entry.items.map((item, index) => (
                        <div key={index} className="text-xs flex justify-between">
                          <span>{item.name}</span>
                          <span className="text-muted-foreground">{item.calories} cal</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </TabsContent>
        
        {["breakfast", "lunch", "dinner", "snack"].map((mealType) => (
          <TabsContent key={mealType} value={mealType} className="space-y-6 mt-4">
            {loading ? (
              <div className="text-center py-4">Loading nutrition data...</div>
            ) : nutritionEntries.filter(entry => entry.meal.toLowerCase() === mealType).length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No {mealType} meals recorded yet.
              </div>
            ) : (
              Object.entries(entriesByDate).map(([date, entries]) => {
                const filteredEntries = entries.filter(entry => entry.meal.toLowerCase() === mealType)
                if (filteredEntries.length === 0) return null
                
                return (
                  <div key={date} className="space-y-4">
                    <h3 className="text-sm font-medium">{formatDate(date)}</h3>
                    
                    {filteredEntries.map((entry) => (
                      <div key={entry._id} className="space-y-3">
                        <div className="flex items-start">
                          <Avatar className="h-9 w-9 mr-4">
                            <AvatarImage src="" alt={entry.meal} />
                            <AvatarFallback className="text-lg">{getMealIcon(entry.meal)}</AvatarFallback>
                          </Avatar>
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium leading-none">{entry.meal}</p>
                              <Badge variant="outline">{entry.calories} cal</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{entry.time}</p>
                          </div>
                        </div>
                        
                        <div className="pl-12 space-y-1">
                          {entry.items.map((item, index) => (
                            <div key={index} className="text-xs flex justify-between">
                              <span>{item.name}</span>
                              <span className="text-muted-foreground">{item.calories} cal</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              })
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}










