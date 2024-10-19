import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  try {
    // Estrai il token dal cookie
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return new NextResponse(JSON.stringify({ message: 'Token non fornito' }), { status: 401 });
    }

    // Verifica il token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Se la verifica ha successo, restituisci il ruolo dell'utente
    return new NextResponse(JSON.stringify({ role: decoded.role }), { status: 200 });
  } catch (error) {
    console.error('Errore nella verifica del token:', error);
    return new NextResponse(JSON.stringify({ message: 'Token non valido' }), { status: 403 });
  }
}
