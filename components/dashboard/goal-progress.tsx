"use client"

import { Progress } from "@/components/ui/progress"

const goals = [
  {
    id: 1,
    name: "Daily Steps",
    target: 10000,
    current: 8249,
    unit: "steps",
  },
  {
    id: 2,
    name: "Weekly Running Distance",
    target: 20,
    current: 13.5,
    unit: "km",
  },
  {
    id: 3,
    name: "Monthly Workout Sessions",
    target: 20,
    current: 12,
    unit: "sessions",
  },
  {
    id: 4,
    name: "Weight Goal",
    target: 70,
    current: 75,
    unit: "kg",
    isReverse: true,
  },
]

export function GoalProgress() {
  return (
    <div className="space-y-6">
      {goals.map((goal) => {
        const percentage = goal.isReverse
          ? 100 - Math.min(100, (goal.current / goal.target) * 100)
          : Math.min(100, (goal.current / goal.target) * 100)

        return (
          <div key={goal.id} className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">{goal.name}</span>
              <span className="text-sm text-muted-foreground">
                {goal.current} / {goal.target} {goal.unit}
              </span>
            </div>
            <Progress value={percentage} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {percentage.toFixed(0)}% {goal.isReverse ? "to target" : "complete"}
            </p>
          </div>
        )
      })}
    </div>
  )
}
