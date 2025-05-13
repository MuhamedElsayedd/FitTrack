import type React from "react"
interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <img 
              src="/favicon.png" 
              alt="FitTrack Logo" 
              className="h-6 w-6" 
            />
            <span className="font-bold">FitTrack</span>
          </div>
          <nav className="flex items-center space-x-4">
            <div className="relative h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
              <span className="text-xs font-bold">JD</span>
            </div>
          </nav>
        </div>
      </header>
      <main className="flex-1 container py-6 space-y-6">{children}</main>
    </div>
  )
}



