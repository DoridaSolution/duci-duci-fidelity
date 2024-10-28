import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { pool } from '../../../../lib/db';

export async function POST(request) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return new NextResponse(JSON.stringify({ message: 'Token non fornito' }), { status: 401 });
  }

  try {
    // Verifica il token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { purchaseId, userId } = await request.json();

    // Verifica se l'acquisto esiste e ottieni il prodotto e l'utente associati
    const purchaseResult = await pool.query(
      'SELECT user_id, product_id FROM purchases WHERE id = $1',
      [purchaseId]
    );

    if (purchaseResult.rows.length === 0) {
      return new NextResponse(JSON.stringify({ message: 'Acquisto non trovato.' }), { status: 404 });
    }

    const purchase = purchaseResult.rows[0];

    // Controlla se l'utente è l'amministratore o l'utente che ha effettuato l'acquisto
    if (decoded.role !== 'admin' && decoded.userId !== purchase.user_id) {
      return new NextResponse(JSON.stringify({ message: 'Accesso negato. Solo l\'amministratore o il proprietario dell\'acquisto possono effettuare questa operazione.' }), { status: 403 });
    }

    // Recupera i punti dell'utente dalla tabella `users`
    const userResult = await pool.query('SELECT points FROM users WHERE id = $1', [purchase.user_id]);

    if (userResult.rows.length === 0) {
      return new NextResponse(JSON.stringify({ message: 'Utente non trovato.' }), { status: 404 });
    }

    const userPoints = userResult.rows[0].points;

    // Calcolo dei punti da restituire (ipotizziamo che siano memorizzati nel prodotto)
    const productResult = await pool.query('SELECT points FROM products WHERE id = $1', [purchase.product_id]);

    if (productResult.rows.length === 0) {
      return new NextResponse(JSON.stringify({ message: 'Prodotto non trovato.' }), { status: 404 });
    }

    const pointsToReturn = productResult.rows[0].points;

    // Restituzione dei punti all'utente
    await pool.query('UPDATE users SET points = points + $1 WHERE id = $2', [pointsToReturn, purchase.user_id]);

    // Eliminazione dell'acquisto
    await pool.query('DELETE FROM purchases WHERE id = $1', [purchaseId]);

    return new NextResponse(JSON.stringify({ message: 'Acquisto eliminato con successo e punti restituiti.' }), { status: 200 });
  } catch (error) {
    console.error('Errore durante l\'eliminazione dell\'acquisto:', error);
    return new NextResponse(JSON.stringify({ message: 'Errore durante l\'eliminazione dell\'acquisto.' }), { status: 500 });
  }
}
