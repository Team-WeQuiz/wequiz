import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|fonts|images).*)'],
};

const protectedRoutes = ['/main-lobby'];
const publicRoutes = ['/sign-in', '/sign-up'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken');
  const currentPath = request.nextUrl.pathname;
  console.log(token);

  if (!token && protectedRoutes.includes(currentPath)) {
    const url = request.nextUrl.clone();
    url.pathname = '/sign-in';
    return NextResponse.redirect(url);
  }

  if (token && publicRoutes.includes(currentPath)) {
    const url = request.nextUrl.clone();
    url.pathname = '/main-lobby';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
