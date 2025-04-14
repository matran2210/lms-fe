import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// Define route patterns for different roles
const roleRoutePatterns: Record<string, string[]> = {
  teacher: ['/teachers'],
}

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/api/auth/login',
  '/api/auth/callback',
  '/api/auth/logout',
  '/login',
  '/about',
  '/404',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (publicRoutes.some((route) => pathname === route)) {
    return NextResponse.next()
  }

  try {
    const token = request.cookies.get('keycloak-token')

    if (!token) {
      const url = new URL('/api/auth/login', request.url)
      url.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(url)
    }

    const decoded = JSON.parse(
      Buffer.from(token?.valueOf()?.split('.')[1] || '', 'base64').toString(),
    )

    // Extract roles from the token
    const role: 'TEACHER' | 'STUDENT' = decoded.user_type

    // For teachers, check specific routes
    if (role === 'TEACHER') {
      const hasAccess = roleRoutePatterns.teacher.some(
        (pattern) => pathname === pattern || pathname.startsWith(`${pattern}/`),
      )

      if (hasAccess) {
        return NextResponse.next()
      }
      return NextResponse.redirect(new URL('/404', request.url))
    }

    // For students, block teacher routes and allow everything else
    if (role === 'STUDENT') {
      if (pathname.startsWith('/teacher')) {
        return NextResponse.redirect(new URL('/404', request.url))
      }
      return NextResponse.next()
    }

    // User is authenticated and has the required role
    return NextResponse.next()
  } catch (error) {
    return NextResponse.redirect(new URL('/404', request.url))
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$|assets/.*).*)'],
}
