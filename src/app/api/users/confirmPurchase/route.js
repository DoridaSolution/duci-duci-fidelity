// src/app/api/users/confirmPurchase/route.js
import { NextResponse } from 'next/server';
import { pool } from '../../../lib/db'; // Assicurati che il percorso sia corretto

export async function POST(request) {
  const { userId, productId } = await request.json();

  try {
    // Logica per confermare l'acquisto, ad esempio sottrarre i punti all'utente
    await pool.query('UPDATE users SET points = points - (SELECT points FROM products WHERE id = $1) WHERE id = $2', [productId, userId]);

    // Puoi anche gestire ulteriori logiche come la registrazione della transazione

    return new NextResponse(JSON.stringify({ message: 'Acquisto confermato!' }), { status: 200 });
  } catch (error) {
    console.error('Errore durante la conferma dell\'acquisto:', error);
    return new NextResponse(JSON.stringify({ message: 'Errore durante la conferma.' }), { status: 500 });
  }
}
