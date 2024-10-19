import { NextResponse } from 'next/server';
import { pool } from '../../../lib/db'; // Assicurati che il percorso sia corretto
import jwt from 'jsonwebtoken';

export async function POST(request) {
  // Ottieni il token dal cookie HTTP-only
  const tokenObj = request.cookies.get('token'); // Accedi all'oggetto cookie

  // Verifica che il token esista e che sia un oggetto con un valore
  if (!tokenObj || !tokenObj.value) {
    console.log("Token non fornito");
    return new NextResponse(JSON.stringify({ message: 'Token non fornito' }), { status: 401 });
  }

  const token = tokenObj.value; // Estrai il valore del token

  console.log("Token recuperato dai cookie:", token);

  try {
    // Verifica il token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    console.log("Token decodificato con successo. User ID:", userId);

    const { productId } = await request.json();

    // Controlla se l'utente esiste nel database
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);

    if (userResult.rows.length === 0) {
      console.log("Utente non trovato per ID:", userId);
      return new NextResponse(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }

    // Implementa la logica di notifica dell'admin, inserendo un acquisto nella tabella "purchases"
    await pool.query('INSERT INTO purchases (user_id, product_id) VALUES ($1, $2)', [userId, productId]);

    return new NextResponse(JSON.stringify({ message: 'Admin notified of the purchase.' }), { status: 200 });
  } catch (error) {
    console.error('Errore nella verifica del token:', error.message);
    return new NextResponse(JSON.stringify({ message: 'Token non valido' }), { status: 403 });
  }
}
