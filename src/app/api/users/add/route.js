import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { pool } from '../../../lib/db';  // Assicurati che il percorso sia corretto

export async function POST(request) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return new NextResponse(JSON.stringify({ message: 'Token non fornito' }), { status: 401 });
  }

  try {
    // Verifica e decodifica il token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verifica se l'utente ha il ruolo di "admin"
    if (decoded.role !== 'admin') {
      return new NextResponse(JSON.stringify({ message: 'Accesso negato. Solo gli amministratori possono effettuare questa operazione.' }), { status: 403 });
    }

    // Estrai email e punti da aggiungere dal corpo della richiesta
    const { email, pointsToAdd } = await request.json();

    // Aggiungi i punti all'utente utilizzando l'email
    await pool.query('UPDATE users SET points = points + $1 WHERE email = $2', [pointsToAdd, email]);

    return new NextResponse(JSON.stringify({ message: 'Punti aggiunti con successo' }), { status: 200 });
  } catch (error) {
    console.error('Errore durante la verifica del token o aggiornamento dei punti:', error);
    return new NextResponse(JSON.stringify({ message: 'Errore durante la verifica del token o aggiornamento dei punti' }), { status: 403 });
  }
}
