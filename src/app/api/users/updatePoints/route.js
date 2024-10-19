import { NextResponse } from 'next/server';
import { pool } from '../../../lib/db'; // Assicurati che il percorso sia corretto
import jwt from 'jsonwebtoken';

export async function POST(request) {
  // Ottieni il token dal cookie HTTP-only
  const tokenObj = request.cookies.get('token'); // Accedi al token dal cookie

  // Verifica che il token esista e che sia valido
  if (!tokenObj || !tokenObj.value) {
    return new NextResponse(JSON.stringify({ message: 'Token non fornito' }), { status: 401 });
  }

  const token = tokenObj.value; // Estrai il valore del token

  try {
    // Verifica e decodifica il token JWT per ottenere l'ID dell'utente
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Ottieni i punti da sottrarre dal corpo della richiesta
    const { pointsToDeduct } = await request.json();

    // Aggiorna i punti dell'utente utilizzando l'ID estratto dal token
    await pool.query('UPDATE users SET points = points - $1 WHERE id = $2', [pointsToDeduct, userId]);

    console.log(`Punti aggiornati per l'utente ID: ${userId}`);

    return new NextResponse(JSON.stringify({ message: 'Punti aggiornati con successo.' }), { status: 200 });
  } catch (error) {
    console.error('Errore durante la verifica del token o l\'aggiornamento dei punti:', error.message);
    return new NextResponse(JSON.stringify({ message: 'Errore durante l\'aggiornamento dei punti.' }), { status: 500 });
  }
}
