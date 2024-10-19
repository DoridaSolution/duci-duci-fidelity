import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { pool } from '../../lib/db';  // Assicurati che il percorso sia corretto

export async function GET(request) {
  // Estrai il token dall'intestazione Authorization
  const token = request.headers.get('Authorization')?.split(' ')[1];

  // Se non esiste, restituisci un errore
  if (!token) {
    return new NextResponse(JSON.stringify({ message: 'Token non fornito' }), { status: 401 });
  }

  try {
    // Verifica il token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Utilizza decoded.userId per accedere alle informazioni dell'utente
    const userId = decoded.userId;

    // Recupera i dati dell'utente dal database se necessario
    const userResult = await pool.query('SELECT name, email FROM users WHERE id = $1', [userId]);

    if (userResult.rows.length === 0) {
      return new NextResponse(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }

    const user = userResult.rows[0];

    // Restituisci i dati dell'utente
    return new NextResponse(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error('Token verification error:', error);
    return new NextResponse(JSON.stringify({ message: 'Token non valido' }), { status: 403 });
  }
}
