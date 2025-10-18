// client/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Server-side session check for middleware
const checkServerSession = async (cookieHeader: string | null) => {
  const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? 'https://project-managment-oqvb.onrender.com'
    : 'http://localhost:8000';

  try {
    console.log('🔍 Checking session with cookies:', cookieHeader);
    
    const response = await fetch(`${API_BASE_URL}/api/me`, {
      headers: {
        'Cookie': cookieHeader || '',
      },
      credentials: 'include',
    });

    console.log('📨 Response status:', response.status);
    console.log('📨 Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const sessionData = await response.json();
      console.log("CheckServerSession data:", sessionData);
      return !!sessionData?.user;
    }
    
    console.log('❌ Response not OK, status:', response.status);
    return false;
    
  } catch (error) {
    console.error('💥 Session check failed:', error);
    return false;
  }
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  if (pathname.startsWith('/_next/') || 
      pathname.startsWith('/api/') || 
      pathname.match(/\.(?:svg|png|jpg|jpeg|gif|webp|ico)$/)) {
    return NextResponse.next();
  }

  // Use the server-side session check
  const hasValidSession = await checkServerSession(request.headers.get('cookie'));
  
  console.log(`Path: ${pathname}, Has Session: ${hasValidSession}, Is Public: ${isPublicRoute}`);

  if (!hasValidSession && !isPublicRoute) {
    console.log(`🚫 No session for ${pathname}, redirecting to login`);
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  if (hasValidSession && isPublicRoute) {
    console.log(`🔄 Redirecting authenticated user from ${pathname} to home`);
    return NextResponse.redirect(new URL('/', request.url));
  }

  console.log(`✅ Allowing access to ${pathname}`);
  return NextResponse.next();
}