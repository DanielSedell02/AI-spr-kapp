import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

// Paths that don't require authentication
const publicPaths = [
  '/',
  '/signin',
  '/signup',
  '/about',
  '/api/auth/signin',
  '/api/auth/signup',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public paths
  if (publicPaths.includes(pathname)) {
    return NextResponse.next()
  }

  // Check for API routes
  if (pathname.startsWith('/api/')) {
    // Allow public API routes
    if (pathname.startsWith('/api/auth/')) {
      return NextResponse.next()
    }

    // Verify token for protected API routes
    const token = request.headers.get('authorization')?.split(' ')[1]
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET)
      await jwtVerify(token, secret)
      return NextResponse.next()
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }
  }

  // Handle client-side routes
  const token = request.cookies.get('token')?.value
  if (!token) {
    const url = new URL('/signin', request.url)
    url.searchParams.set('from', pathname)
    return NextResponse.redirect(url)
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    await jwtVerify(token, secret)
    return NextResponse.next()
  } catch (error) {
    // Clear invalid token
    const response = NextResponse.redirect(new URL('/signin', request.url))
    response.cookies.delete('token')
    return response
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
} 