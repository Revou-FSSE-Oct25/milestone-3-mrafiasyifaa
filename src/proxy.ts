import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { protectedRoutes } from '@/src/config/protectedroutes';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if(pathname === '/unauthorized'){
    return NextResponse.next()
  }

  const protectedRoute = protectedRoutes.find((route) =>
    pathname.startsWith(route.path)
  );

  if (protectedRoute) {
    const authCookie = request.cookies.get('auth_session');

    if (!authCookie) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const user = JSON.parse(authCookie.value);

      if (!protectedRoute.allowedRoles.includes(user.role)) {
        const unauthorizedUrl = new URL('/unauthorized', request.url);
        return NextResponse.redirect(unauthorizedUrl);
      }

      return NextResponse.next();
    } catch (error) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('auth_session');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/cart/:path*', '/admin/:path*', '/dashboard/:path*'],
};