import { COOKIE_INFO } from '@/constants'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const hasUser = req.cookies.get(COOKIE_INFO.KEYCLOAK_TOKEN)?.value
  // Cho phép trang /
  if (path === '/') {
    return NextResponse.next()
  }

  // Chưa login → rewrite về /
if (!hasUser) {
  return NextResponse.next()
}

  const res = NextResponse.next()

  // COOP / COEP cho meeting
  if (path.startsWith('/meeting')) {
    res.headers.set('Cross-Origin-Opener-Policy', 'same-origin')
    res.headers.set('Cross-Origin-Embedder-Policy', 'require-corp')
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
