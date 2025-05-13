"use client"

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
import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { addNutritionEntry } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

interface AddMealDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onMealAdded?: () => void
}

interface FoodItem {
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

export function AddMealDialog({ open, onOpenChange, onMealAdded }: AddMealDialogProps) {
  const [date, setDate] = useState<Date>(new Date())
  const [mealType, setMealType] = useState<string>("")
  const [time, setTime] = useState<string>("")
  const [foodItems, setFoodItems] = useState<FoodItem[]>([
    { name: "", calories: 0, protein: 0, carbs: 0, fat: 0 }
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  
  const addFoodItem = () => {
    setFoodItems([...foodItems, { name: "", calories: 0, protein: 0, carbs: 0, fat: 0 }])
  }
  
  const removeFoodItem = (index: number) => {
    if (foodItems.length > 1) {
      setFoodItems(foodItems.filter((_, i) => i !== index))
    }
  }
  
  const updateFoodItem = (index: number, field: keyof FoodItem, value: string | number) => {
    const updatedItems = [...foodItems]
    updatedItems[index] = { 
      ...updatedItems[index], 
      [field]: typeof value === 'string' && field !== 'name' ? parseFloat(value) || 0 : value 
    }
    setFoodItems(updatedItems)
  }
  
  const calculateTotals = () => {
    return foodItems.reduce(
      (totals, item) => {
        return {
          calories: totals.calories + item.calories,
          protein: totals.protein + item.protein,
          carbs: totals.carbs + item.carbs,
          fat: totals.fat + item.fat
        }
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    )
  }
  
  const handleSubmit = async () => {
    // Validate form
    if (!mealType || !time || foodItems.some(item => !item.name)) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const totals = calculateTotals()
      
      // Format the date properly
      const formattedDate = format(date, "yyyy-MM-dd")
      
      console.log("Submitting nutrition entry:", {
        meal: mealType,
        time: time,
        calories: totals.calories,
        protein: totals.protein,
        carbs: totals.carbs,
        fat: totals.fat,
        items: foodItems,
        date: formattedDate
      })
      
      await addNutritionEntry({
        meal: mealType,
        time: time,
        calories: totals.calories,
        protein: totals.protein,
        carbs: totals.carbs,
        fat: totals.fat,
        items: foodItems,
        date: formattedDate
      })
      
      // Reset form and close dialog
      setMealType("")
      setTime("")
      setFoodItems([{ name: "", calories: 0, protein: 0, carbs: 0, fat: 0 }])
      
      toast({
        title: "Meal added",
        description: "Your meal has been recorded successfully"
      })
      
      // Call the callback to refresh nutrition entries
      if (onMealAdded) {
        onMealAdded()
      }
      
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to add meal:", error)
      toast({
        title: "Error",
        description: "Failed to add meal",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const totals = calculateTotals()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Add Meal</DialogTitle>
          <DialogDescription>Record your meal details to track your nutrition.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="meal-type" className="text-right">
              Meal Type
            </Label>
            <Select value={mealType} onValueChange={setMealType}>
              <SelectTrigger id="meal-type" className="col-span-3">
                <SelectValue placeholder="Select meal type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Breakfast">Breakfast</SelectItem>
                <SelectItem value="Lunch">Lunch</SelectItem>
                <SelectItem value="Dinner">Dinner</SelectItem>
                <SelectItem value="Snack">Snack</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="time" className="text-right">
              Time
            </Label>
            <Input 
              id="time" 
              type="time" 
              value={time} 
              onChange={(e) => setTime(e.target.value)} 
              className="col-span-3" 
            />
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
          
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium">Food Items</h3>
              <Button type="button" variant="outline" size="sm" onClick={addFoodItem}>
                <Plus className="h-4 w-4 mr-1" /> Add Item
              </Button>
            </div>
            
            <div className="space-y-3">
              {/* Header */}
              <div className="grid grid-cols-12 gap-2 text-xs font-medium text-muted-foreground px-1">
                <div className="col-span-4">Name</div>
                <div className="col-span-2">Calories</div>
                <div className="col-span-2">Protein (g)</div>
                <div className="col-span-2">Carbs (g)</div>
                <div className="col-span-1">Fat (g)</div>
                <div className="col-span-1"></div>
              </div>
              
              {/* Food items */}
              {foodItems.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-center">
                  <Input
                    className="col-span-4"
                    value={item.name}
                    onChange={(e) => updateFoodItem(index, "name", e.target.value)}
                    placeholder="Food name"
                  />
                  <Input
                    className="col-span-2"
                    type="number"
                    value={item.calories || ""}
                    onChange={(e) => updateFoodItem(index, "calories", e.target.value)}
                    placeholder="0"
                  />
                  <Input
                    className="col-span-2"
                    type="number"
                    value={item.protein || ""}
                    onChange={(e) => updateFoodItem(index, "protein", e.target.value)}
                    placeholder="0"
                  />
                  <Input
                    className="col-span-2"
                    type="number"
                    value={item.carbs || ""}
                    onChange={(e) => updateFoodItem(index, "carbs", e.target.value)}
                    placeholder="0"
                  />
                  <Input
                    className="col-span-1"
                    type="number"
                    value={item.fat || ""}
                    onChange={(e) => updateFoodItem(index, "fat", e.target.value)}
                    placeholder="0"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="col-span-1 h-8 w-8"
                    onClick={() => removeFoodItem(index)}
                    disabled={foodItems.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              {/* Totals */}
              <div className="grid grid-cols-12 gap-2 pt-2 border-t text-sm font-medium">
                <div className="col-span-4 flex items-center">Totals</div>
                <div className="col-span-2">{totals.calories} cal</div>
                <div className="col-span-2">{totals.protein}g</div>
                <div className="col-span-2">{totals.carbs}g</div>
                <div className="col-span-1">{totals.fat}g</div>
                <div className="col-span-1"></div>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save meal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

