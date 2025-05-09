"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from "recharts"

const activityData = [
  { name: "Running", value: 120, color: "#FF6384" },
  { name: "Cycling", value: 80, color: "#36A2EB" },
  { name: "Swimming", value: 40, color: "#FFCE56" },
  { name: "Yoga", value: 60, color: "#4BC0C0" },
  { name: "Weight Training", value: 90, color: "#9966FF" },
  { name: "Walking", value: 110, color: "#FF9F40" },
]

const caloriesData = [
  { name: "Burned", value: 1850, color: "#FF6384" },
  { name: "Goal", value: 2500 - 1850, color: "#E8E8E8" },
]

export function ActivitySummary() {
  return (
    <Tabs defaultValue="activities">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="activities">Activities</TabsTrigger>
        <TabsTrigger value="calories">Calories</TabsTrigger>
      </TabsList>
      <TabsContent value="activities" className="space-y-4">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={activityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {activityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} mins`, "Duration"]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>
      <TabsContent value="calories" className="space-y-4">
        <div className="grid gap-4 grid-cols-2">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">1,850</div>
                <p className="text-xs text-muted-foreground">Calories burned</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">2,500</div>
                <p className="text-xs text-muted-foreground">Daily goal</p>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={caloriesData}
                cx="50%"
                cy="50%"
                startAngle={90}
                endAngle={-270}
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                paddingAngle={0}
              >
                {caloriesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-lg font-bold">
                74%
              </text>
              <Tooltip formatter={(value) => [`${value} calories`, ""]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>
    </Tabs>
  )
}
