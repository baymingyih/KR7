import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authPages = ['/login', '/register', '/forgot-password'];
  const protectedPages = ['/dashboard'];
  const path = request.nextUrl.pathname;

  // Get auth token from cookie
  const token = request.cookies.get('auth_token');

  // If trying to access protected page without auth
  if (protectedPages.includes(path) && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If trying to access auth pages while logged in
  if (authPages.includes(path) && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard', '/login', '/register', '/forgot-password'],
};