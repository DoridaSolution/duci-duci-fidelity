// middlewares/authMiddleware.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(request) {
  const token = request.cookies.get('token');
  const refreshToken = request.cookies.get('refreshToken');

  // Se non c'è il token, reindirizza al login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Verifica il token e ottieni i dati dell'utente
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Controlla il ruolo dell'utente
    if (decoded.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Se l'utente è admin, consentiamo l'accesso alla dashboard
    return NextResponse.next();
  } catch (error) {
    // Se il token è scaduto, prova a utilizzare il refresh token
    if (refreshToken) {
      try {
        const refreshDecoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
        // Genera un nuovo access token e aggiorna i cookie
        const newToken = jwt.sign({ id: refreshDecoded.id, role: refreshDecoded.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
        // Aggiorna il cookie
        request.cookies.set('token', newToken, { httpOnly: true, secure: true });

        // Procedi con la richiesta
        return NextResponse.next();
      } catch (refreshError) {
        // Se anche il refresh token è scaduto o non valido, reindirizza al login
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }

    // Se il token non è valido, reindirizza al login
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/dashboard','/newdash' ],
   // Applica il middleware solo alla pagina dashboard
};
