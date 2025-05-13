"use client"

import Dashboard from "@/components/dashboard/dashboard"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter()
  
  useEffect(() => {
    // Check if auth token exists in cookies
    const hasAuthToken = document.cookie.includes('auth-token=')
    
    if (!hasAuthToken) {
      router.push('/login')
    }
  }, [router])

  return <Dashboard />
}
