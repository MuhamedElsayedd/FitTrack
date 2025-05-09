"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  {
    name: "Mon",
    steps: 4000,
    calories: 240,
    activeMinutes: 24,
  },
  {
    name: "Tue",
    steps: 5670,
    calories: 320,
    activeMinutes: 32,
  },
  {
    name: "Wed",
    steps: 7890,
    calories: 480,
    activeMinutes: 48,
  },
  {
    name: "Thu",
    steps: 9000,
    calories: 580,
    activeMinutes: 58,
  },
  {
    name: "Fri",
    steps: 8000,
    calories: 500,
    activeMinutes: 50,
  },
  {
    name: "Sat",
    steps: 10500,
    calories: 650,
    activeMinutes: 65,
  },
  {
    name: "Sun",
    steps: 6500,
    calories: 400,
    activeMinutes: 40,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip />
        <Bar dataKey="steps" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Steps" />
      </BarChart>
    </ResponsiveContainer>
  )
}
