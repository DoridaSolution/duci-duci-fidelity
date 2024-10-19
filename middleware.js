import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(request) {
  const token = request.cookies.get('token');

  // Se non c'è il token, reindirizza al login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Verifica il token e ottieni i dati dell'utente
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Se l'utente non è admin, reindirizza alla home o a un'altra pagina
    if (decoded.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Se l'utente è admin, consentiamo l'accesso alla dashboard
    return NextResponse.next();
  } catch (error) {
    // Se il token non è valido, reindirizza al login
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/dashboard'], // Applica il middleware solo alla pagina dashboard
};
