import { NextRequest, NextResponse } from 'next/server'

// Define protected routes that require authentication
const protectedRoutes = ['/dashboard']
const authRoutes = ['/login', '/signup']

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // Check if there's an auth token cookie
  const isAuthenticated = request.cookies.has('auth-token')
  
  // If user is trying to access a protected route but isn't authenticated
  if (protectedRoutes.some(route => path.startsWith(route)) && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // If user is authenticated and trying to access login/signup pages
  if (authRoutes.includes(path) && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  // If user clicks "Get Started" or similar links on homepage without being authenticated
  if (path === '/' && request.nextUrl.searchParams.has('auth') && !isAuthenticated) {
    return NextResponse.redirect(new URL('/signup', request.url))
  }
  
  return NextResponse.next()
}

// Configure which routes the middleware should run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
}



