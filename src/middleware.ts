import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define route patterns for different roles
const roleRoutePatterns: Record<string, string[]> = {
  teacher: ['/teacher'],
  student: ['/courses'],
  admin: ['/admin', '/settings'],
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
  '/overview',
  '/dashboard',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the route is public
  if (
    publicRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    )
  ) {
    return NextResponse.next()
  }

  //   Check if user is authenticated
  //   const token = request.cookies.get('keycloak-token')

  //   if (!token) {
  //     // Redirect to login if not authenticated
  //     const url = new URL('/api/auth/login', request.url)
  //     url.searchParams.set('callbackUrl', pathname)
  //     return NextResponse.redirect(url)
  //   }

  try {
    // Decode the JWT token to get user roles
    // In production, you should verify the token signature
    // const decoded = JSON.parse(
    //   Buffer.from(token.value.split('.')[1], 'base64').toString(),
    // )

    // Extract roles from the token
    // Keycloak typically includes roles in realm_access.roles or resource_access.[client-id].roles
    // const roles: string[] = [
    //   ...(decoded.realm_access?.roles || []),
    //   ...(decoded.resource_access?.[process.env.KEYCLOAK_CLIENT_ID!]?.roles ||
    //     []),
    // ]
    const roles = ['student']

    // Check if the current path matches any pattern for the user's roles
    let hasAccess = false
    for (const role of roles) {
      const patterns = roleRoutePatterns[role]
      if (patterns) {
        const matchesPattern = patterns.some(
          (pattern) =>
            pathname === pattern || pathname.startsWith(`${pattern}/`),
        )
        if (matchesPattern) {
          hasAccess = true
          break
        }
      }
    }

    // If the user does not have access to this route based on their roles
    if (!hasAccess) {
      return NextResponse.redirect(new URL('/404', request.url))
    }

    // User is authenticated and has the required role (or the route doesn't require a specific role)
    return NextResponse.next()
  } catch (error) {}
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$|assets/.*).*)'],
}
