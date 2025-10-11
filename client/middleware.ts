// client/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get('__Secure-better-auth.session_token')?.value || request.cookies.get('better-auth.session_token')?.value; // Fallback for development;
  console.log("this is session token",sessionToken)
  const { pathname } = request.nextUrl;

  // ONLY these routes are public when not authenticated
  const publicRoutes = ['/login', '/register', "/forgot-password",'/reset-password', '/api/auth'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  console.log(`Path: ${pathname}, Has Token: ${!!sessionToken}, Is Public: ${isPublicRoute}`);

  // CASE 1: No session token AND trying to access non-public route → REDIRECT TO LOGIN
  if (!sessionToken && !isPublicRoute) {
    console.log(`🚫 Blocked: No session for ${pathname}, redirecting to login`);
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }else if (sessionToken && isPublicRoute) {
    console.log(`🔄 Redirect: Authenticated user trying to access ${pathname}, going to home`, request.url);
    return NextResponse.redirect(new URL('/',
      request.url));
  }

//   // CASE 2: Has session token AND trying to access login/signup → REDIRECT TO HOME
//   if (sessionToken && (pathname.startsWith('/login') || pathname.startsWith('/signup'))) {
//     console.log(`🔄 Redirect: Authenticated user trying to access ${pathname}, going to home`, request.url);
//     return NextResponse.redirect(new URL('/', request.url));
//   }

  // CASE 3: Allow all other scenarios
  console.log(`✅ Allowing access to ${pathname}`);
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};