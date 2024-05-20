import { NextRequest, NextResponse, URLPattern } from 'next/server';

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|fonts|images).*)'],
};

const protectedPatterns = [
  '/main-lobby',
  '/create-room',
  '/waiting-room/:id',
].map((path) => new URLPattern({ pathname: path }));

const publicRoutes = ['/sign-in', '/sign-up'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('refreshToken');
  const currentPath = request.nextUrl.pathname;

  const isProtectedRoute = protectedPatterns.some((pattern) =>
    pattern.test(request.nextUrl),
  );

  if (!token && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/sign-in';
    url.searchParams.set('message', '로그인이 필요한 페이지입니다.');
    return NextResponse.redirect(url);
  }

  if (token && publicRoutes.includes(currentPath)) {
    const url = request.nextUrl.clone();
    url.pathname = '/main-lobby';
    url.searchParams.set('message', '이미 로그인된 상태입니다.');
    return NextResponse.redirect(url);
  }

  const response = NextResponse.next();
  response.headers.set('Content-Security-Policy', 'upgrade-insecure-requests');

  return response;
}
