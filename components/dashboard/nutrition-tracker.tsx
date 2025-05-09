"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const meals = [
  {
    id: 1,
    name: "Breakfast",
    time: "8:00 AM",
    calories: 450,
    items: [
      { name: "Oatmeal", calories: 150, protein: 5, carbs: 27, fat: 3 },
      { name: "Banana", calories: 105, protein: 1, carbs: 27, fat: 0 },
      { name: "Greek Yogurt", calories: 100, protein: 17, carbs: 6, fat: 0 },
      { name: "Honey", calories: 65, protein: 0, carbs: 17, fat: 0 },
      { name: "Almonds", calories: 30, protein: 1, carbs: 1, fat: 3 },
    ],
    icon: "🍳",
  },
  {
    id: 2,
    name: "Lunch",
    time: "12:30 PM",
    calories: 680,
    items: [
      { name: "Grilled Chicken Breast", calories: 165, protein: 31, carbs: 0, fat: 3.6 },
      { name: "Brown Rice", calories: 215, protein: 5, carbs: 45, fat: 1.8 },
      { name: "Steamed Broccoli", calories: 55, protein: 3.7, carbs: 11, fat: 0.6 },
      { name: "Olive Oil", calories: 120, protein: 0, carbs: 0, fat: 14 },
      { name: "Apple", calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
      { name: "Water", calories: 0, protein: 0, carbs: 0, fat: 0 },
    ],
    icon: "🥗",
  },
  {
    id: 3,
    name: "Snack",
    time: "4:00 PM",
    calories: 220,
    items: [{ name: "Protein Bar", calories: 220, protein: 20, carbs: 23, fat: 8 }],
    icon: "🍌",
  },
  {
    id: 4,
    name: "Dinner",
    time: "7:30 PM",
    calories: 750,
    items: [
      { name: "Salmon Fillet", calories: 280, protein: 39, carbs: 0, fat: 13 },
      { name: "Sweet Potato", calories: 180, protein: 4, carbs: 41, fat: 0 },
      { name: "Asparagus", calories: 40, protein: 4, carbs: 7, fat: 0 },
      { name: "Quinoa", calories: 120, protein: 4, carbs: 21, fat: 2 },
      { name: "Lemon Juice", calories: 10, protein: 0, carbs: 3, fat: 0 },
      { name: "Olive Oil", calories: 120, protein: 0, carbs: 0, fat: 14 },
    ],
    icon: "🍽️",
  },
]

const nutritionSummary = {
  calories: {
    consumed: 2100,
    goal: 2500,
  },
  macros: {
    protein: { consumed: 140, goal: 150 },
    carbs: { consumed: 250, goal: 300 },
    fat: { consumed: 70, goal: 80 },
  },
}

export function NutritionTracker() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{nutritionSummary.calories.consumed}</div>
              <p className="text-xs text-muted-foreground">Calories consumed</p>
              <Progress
                value={(nutritionSummary.calories.consumed / nutritionSummary.calories.goal) * 100}
                className="h-2 mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {nutritionSummary.calories.goal - nutritionSummary.calories.consumed} calories remaining
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{nutritionSummary.macros.protein.consumed}g</div>
              <p className="text-xs text-muted-foreground">Protein</p>
              <Progress
                value={(nutritionSummary.macros.protein.consumed / nutritionSummary.macros.protein.goal) * 100}
                className="h-2 mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">Goal: {nutritionSummary.macros.protein.goal}g</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{nutritionSummary.macros.carbs.consumed}g</div>
              <p className="text-xs text-muted-foreground">Carbs</p>
              <Progress
                value={(nutritionSummary.macros.carbs.consumed / nutritionSummary.macros.carbs.goal) * 100}
                className="h-2 mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">Goal: {nutritionSummary.macros.carbs.goal}g</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{nutritionSummary.macros.fat.consumed}g</div>
              <p className="text-xs text-muted-foreground">Fat</p>
              <Progress
                value={(nutritionSummary.macros.fat.consumed / nutritionSummary.macros.fat.goal) * 100}
                className="h-2 mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">Goal: {nutritionSummary.macros.fat.goal}g</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="breakfast">Breakfast</TabsTrigger>
          <TabsTrigger value="lunch">Lunch</TabsTrigger>
          <TabsTrigger value="snack">Snack</TabsTrigger>
          <TabsTrigger value="dinner">Dinner</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4 mt-4">
          {meals.map((meal) => (
            <div key={meal.id} className="flex items-start">
              <Avatar className="h-9 w-9 mr-4">
                <AvatarImage src="" alt={meal.name} />
                <AvatarFallback className="text-lg">{meal.icon}</AvatarFallback>
              </Avatar>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium leading-none">{meal.name}</p>
                  <Badge variant="outline">{meal.calories} cal</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{meal.time}</p>
                <div className="mt-2 text-xs text-muted-foreground">
                  {meal.items.map((item, index) => (
                    <span key={index}>
                      {item.name}
                      {index < meal.items.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </TabsContent>
        {["breakfast", "lunch", "snack", "dinner"].map((mealType) => (
          <TabsContent key={mealType} value={mealType} className="space-y-4 mt-4">
            {meals
              .filter((meal) => meal.name.toLowerCase() === mealType)
              .map((meal) => (
                <div key={meal.id}>
                  <div className="flex items-start">
                    <Avatar className="h-9 w-9 mr-4">
                      <AvatarImage src="" alt={meal.name} />
                      <AvatarFallback className="text-lg">{meal.icon}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium leading-none">{meal.name}</p>
                        <Badge variant="outline">{meal.calories} cal</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{meal.time}</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    {meal.items.map((item, index) => (
                      <div key={index} className="grid grid-cols-5 text-sm">
                        <div className="col-span-2">{item.name}</div>
                        <div className="text-right">{item.calories} cal</div>
                        <div className="text-right">{item.protein}g protein</div>
                        <div className="text-right">{item.carbs}g carbs</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
