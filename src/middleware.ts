import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { PageLink } from './constants'

// Define route patterns for different roles
const roleRoutePatterns: Record<string, string[]> = {
  teacher: ['/teachers'],
}

// Define public routes that don't require authentication
const publicRoutes = ['/404', '/', '/firebase-messaging-sw.js']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip processing for /404 to avoid infinite redirect loop
  if (pathname === '/404') {
    return NextResponse.next()
  }

  // Allow requests that start with /certificates to pass through
  if (pathname.startsWith('/certificates')) {
    return NextResponse.next()
  }

  try {
    const token = request.cookies.get('keycloak-token')

    // Decode the token to get the user's role
    const decoded = JSON.parse(
      Buffer.from(token?.valueOf()?.split('.')[1] || '', 'base64').toString(),
    )

    const role: 'TEACHER' | 'STUDENT' = decoded.user_type

    // If the user is already on the target route, avoid redirecting
    if (pathname === '/' || publicRoutes.includes(pathname)) {
      if (role === 'TEACHER' && pathname !== PageLink.TEACHERS) {
        return NextResponse.redirect(new URL(PageLink.TEACHERS, request.url))
      }
      if (role === 'STUDENT' && pathname !== '/courses') {
        return NextResponse.redirect(new URL('/courses', request.url))
      }
    }

    // 🔐 Role-based access control for protected routes
    if (role === 'TEACHER') {
      const hasAccess = roleRoutePatterns.teacher.some(
        (pattern) => pathname === pattern || pathname.startsWith(`${pattern}/`),
      )
      if (!hasAccess) {
        return NextResponse.redirect(new URL('/404', request.url))
      }
      return NextResponse.next()
    }

    if (role === 'STUDENT') {
      if (pathname.startsWith(PageLink.TEACHERS)) {
        return NextResponse.redirect(new URL('/404', request.url))
      }
      return NextResponse.next()
    }

    // Default behavior
    return NextResponse.next()
  } catch (error) {
    return NextResponse.redirect(new URL('/404', request.url))
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$|assets/.*).*)'],
}
