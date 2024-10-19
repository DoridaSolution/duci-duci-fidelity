import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { pool } from '../../../lib/db';  // Assicurati che il percorso sia corretto

export async function POST(request) {
  const token = request.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    return new NextResponse(JSON.stringify({ message: 'Token non fornito' }), { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email, pointsToAdd } = await request.json();  // Punti da aggiungere e email

    // Aggiungi i punti all'utente utilizzando l'email
    await pool.query('UPDATE users SET points = points + $1 WHERE email = $2', [pointsToAdd, email]);

    return new NextResponse(JSON.stringify({ message: 'Punti aggiunti con successo' }), { status: 200 });
  } catch (error) {
    console.error('Token verification error:', error);
    return new NextResponse(JSON.stringify({ message: 'Token non valido' }), { status: 403 });
  }
}
