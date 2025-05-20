import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Si l'utilisateur est authentifié et essaie d'accéder aux pages d'auth
    // (comme login/register), le rediriger vers la page d'accueil
    if (req.nextUrl.pathname.startsWith('/auth/') && req.nextauth.token) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// Spécifiez les routes qui nécessitent une authentification
export const config = {
  matcher: [
    // Ces routes nécessitent une authentification
    '/',
    '/books/:path*',
    '/bookcopies/:path*',
    '/profile/:path*',
    '/loans/:path*',
    // Vous pouvez ajouter d'autres routes protégées ici
  ],
};
