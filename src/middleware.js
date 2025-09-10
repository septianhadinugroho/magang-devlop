import { NextResponse } from 'next/server';

export function middleware(req) {
  const isLogin = req.cookies.get('is_login'); // Ambil token dari cookie
 
  const { pathname } = req.nextUrl;

  // Jika token tidak ada, redirect ke halaman login
  if ((!isLogin || isLogin.value ==='') && (pathname !== '/login' && pathname !== '/register')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Jika token ada dan pengguna mencoba mengakses halaman login
  if (isLogin && isLogin.value !==''  && pathname === '/login') {
    return NextResponse.redirect(new URL('/', req.url)); // Ganti dengan halaman yang diinginkan
  }
console.log(pathname);
  if (isLogin && isLogin.value !==''  && pathname === '/register') {
    return NextResponse.redirect(new URL('/', req.url)); // Ganti dengan halaman yang diinginkan
  }

  // Jika token ada, lanjutkan ke halaman yang diminta
  return NextResponse.next();
}

// Tentukan path yang ingin diberlakukan middleware
export const config = {
  matcher: ['/','/login','/register','/order','/store','/item','/category', '/grabmart'], // Ganti dengan route yang ingin dilindungi
};