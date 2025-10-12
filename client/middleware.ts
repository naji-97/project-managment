// client/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {getSessionCookie} from "better-auth/cookies";

export function middleware(request: NextRequest) {
//  const sessionCookie = getSessionCookie(request, {
//     cookieName: process.env.NODE_ENV === 'production' ?'__Secure-auth-session': 'auth-session' 
//  });
 console.log("All cookies:", request.cookies);
 const cookieName = process.env.NODE_ENV === 'production'
    ? '__Secure-auth-session'
    : 'auth-session';
const sessionCookie = request.cookies.get(cookieName)?.value;

  console.log("this is session token",sessionCookie)
  const { pathname } = request.nextUrl;

  // ONLY these routes are public when not authenticated
  const publicRoutes = ['/login', '/register', "/forgot-password",'/reset-password', '/api/auth'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // CASE 1: No session token AND trying to access non-public route → REDIRECT TO LOGIN
  if (!sessionCookie && !isPublicRoute) {
    console.log(`🚫 Blocked: No session for ${pathname}, redirecting to login`);
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }else if (sessionCookie && isPublicRoute) {
    console.log(`🔄 Redirect: Authenticated user trying to access ${pathname}, going to home`, request.url);
    return NextResponse.redirect(new URL('/',
      request.url));
  }


  // CASE 3: Allow all other scenarios
  console.log(`✅ Allowing access to ${pathname}`);
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};