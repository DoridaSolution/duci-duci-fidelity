import { NextResponse } from 'next/server';
import { pool } from '../../../../lib/db';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  // Ottieni il token dal cookie HTTP-only
  const token = request.cookies.get('token')?.value;

  if (!token || typeof token !== 'string') {
    return new NextResponse(JSON.stringify({ message: 'Token non fornito o non valido' }), { status: 401 });
  }

  try {
    // Verifica il token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId; // Ottieni l'ID utente dal token

    // Recupera i QR code non verificati dalla tabella "purchases"
    const qrResult = await pool.query('SELECT * FROM purchases WHERE user_id = $1', [userId]);

    // Recupera la cronologia delle transazioni già completate
    const transactionResult = await pool.query('SELECT * FROM transactions WHERE user_id = $1', [userId]);

    return new NextResponse(
      JSON.stringify({
        qrCodes: qrResult.rows,
        transactions: transactionResult.rows,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Errore nel recupero dei QR code e delle transazioni:', error);
    return new NextResponse(JSON.stringify({ message: 'Errore durante il recupero dei dati.' }), { status: 500 });
  }
}
