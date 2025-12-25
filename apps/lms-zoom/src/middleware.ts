import { COOKIE_INFO } from '@/constants'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const hasUser = req.cookies.get(COOKIE_INFO.KEYCLOAK_USER_ID)?.value

  if (path === '/') {
    return NextResponse.next()
  }

  if (!hasUser) {
    const redirectUrl = new URL('/', req.url)
    const token = req.nextUrl.searchParams.get('token')
    if (token) {
      redirectUrl.searchParams.set('token', token)
    }
    return NextResponse.redirect(redirectUrl)
  }

  const res = NextResponse.next()

  // Chỉ bật COOP/COEP cho các route meeting (phục vụ Zoom / SharedArrayBuffer)
  if (path.startsWith('/meeting')) {
    res.headers.set('Cross-Origin-Opener-Policy', 'same-origin')
    res.headers.set('Cross-Origin-Embedder-Policy', 'require-corp')
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
