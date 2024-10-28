import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { pool } from '../../../lib/db';

export async function GET(request) {
  // Ottieni il token dai cookie HTTP-only
  const token = request.cookies.get('token')?.value;

  if (!token || typeof token !== 'string') {
    return new NextResponse(JSON.stringify({ message: 'Token non fornito o non valido' }), { status: 401 });
  }

  try {
    // Verifica il token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Controlla se l'utente ha il ruolo di admin
    if (decoded.role !== 'admin') {
      return new NextResponse(JSON.stringify({ message: 'Accesso negato. Solo l\'amministratore può effettuare questa operazione.' }), { status: 403 });
    }

    // Recupera la lista degli utenti dal database
    const result = await pool.query('SELECT id, name, email, level, total_points FROM users ORDER BY created_at DESC');

    return new NextResponse(JSON.stringify(result.rows), { status: 200 });
  } catch (error) {
    console.error('Errore durante il recupero degli utenti:', error);
    return new NextResponse(JSON.stringify({ message: 'Errore durante il recupero degli utenti.' }), { status: 500 });
  }
}
