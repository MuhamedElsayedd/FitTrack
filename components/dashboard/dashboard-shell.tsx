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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
              <path d="M7 14.5s0 .5 1.5.5 2-1 3.5-1 2.5 1 3.5 1 1.5-.5 1.5-.5" />
              <path d="M7 9.5s0 .5 1.5.5 2-1 3.5-1 2.5 1 3.5 1 1.5-.5 1.5-.5" />
            </svg>
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
