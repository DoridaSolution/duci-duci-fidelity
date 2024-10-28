import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { pool } from '../../../lib/db';  // Assicurati che il percorso sia corretto

export async function POST(request) {
  // Ottieni il token dal cookie HTTP-only
  const token = request.cookies.get('token')?.value;

  if (!token || typeof token !== 'string') {
    return new NextResponse(JSON.stringify({ message: 'Token non fornito o non valido' }), { status: 401 });
  }

  try {
    // Verifica il token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;  // Estrarre l'ID utente dal token JWT

    // Estrazione dei dati dal corpo della richiesta (productId)
    const { productId } = await request.json();

    // Verifica che productId sia fornito
    if (!productId) {
      return new NextResponse(JSON.stringify({ message: 'Dati mancanti: productId' }), { status: 400 });
    }

    // Inserisci una nuova voce di acquisto nella tabella `purchases`
    const insertResult = await pool.query(
      'INSERT INTO purchases (user_id, product_id, created_at) VALUES ($1, $2, NOW()) RETURNING id',
      [userId, productId]
    );

    // Restituisci l'ID del nuovo acquisto
    const purchaseId = insertResult.rows[0].id;

    return new NextResponse(JSON.stringify({ purchaseId }), { status: 200 });
  } catch (error) {
    console.error('Errore durante la creazione dell\'acquisto:', error);
    return new NextResponse(JSON.stringify({ message: 'Errore durante la creazione dell\'acquisto' }), { status: 500 });
  }
}
