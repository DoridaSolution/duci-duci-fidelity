import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { pool } from '../../../../lib/db';  // Assicurati che il percorso sia corretto

export async function GET(request, { params }) {
  const token = request.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    return new NextResponse(JSON.stringify({ message: 'Token non fornito' }), { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = params.id; // Recupera l'ID dai parametri

    // Recupera i punti dell'utente dal database
    const userResult = await pool.query('SELECT points FROM users WHERE id = $1', [userId]);

    if (userResult.rows.length === 0) {
      return new NextResponse(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }

    const points = userResult.rows[0].points;

    return new NextResponse(JSON.stringify({ points }), { status: 200 });
  } catch (error) {
    console.error('Token verification error:', error);
    return new NextResponse(JSON.stringify({ message: 'Token non valido' }), { status: 403 });
  }
}
