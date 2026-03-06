import { NextRequest, NextResponse } from 'next/server';
import { updateSession, decrypt } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  // Protected routes
  const adminPaths = ['/admin'];
  const studentPaths = ['/dashboard', '/student'];
  const authPaths = ['/auth/login', '/auth/register', '/auth/forgot-password'];
  const publicPaths = ['/aluno/carrinho'];

  const { pathname } = request.nextUrl;

  // Check if the current path is protected
  const isAdminPath = adminPaths.some((path) => pathname.startsWith(path));
  const isStudentPath = studentPaths.some((path) => pathname.startsWith(path));
  const isAuthPath = authPaths.some((path) => pathname.startsWith(path));
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // If it's a public path, allow access
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Get session from cookies
  const authToken = request.cookies.get('auth-token')?.value;
  const userData = request.cookies.get('user-data')?.value;

  // If trying to access protected route without session, redirect to login
  if ((isAdminPath || isStudentPath) && (!authToken || !userData)) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // If trying to access auth pages with valid session, redirect based on role
  if (isAuthPath && authToken && userData) {
    try {
      const user = JSON.parse(userData);
      const userRole = user.role;

      if (userRole === 'admin') {
        return NextResponse.redirect(new URL('/admin', request.url));
      } else {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch (error) {
      // Invalid user data, continue to auth page
      console.error('Erro ao parsear dados do usuário:', error);
    }
  }

  // Check role-based access
  if (authToken && userData) {
    try {
      const user = JSON.parse(userData);
      const userRole = user.role;

      // Admin trying to access student area
      if (isStudentPath && userRole === 'admin') {
        return NextResponse.redirect(new URL('/admin', request.url));
      }

      // Student trying to access admin area
      if (isAdminPath && userRole === 'student') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

      // Token exists, continue (could add token validation here)
      return NextResponse.next();
    } catch (error) {
      // Invalid session, redirect to login
      console.error('Erro no middleware:', error);
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|placeholder.svg).*)'],
};
