import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { pool } from '../../../lib/db';

export async function POST(request) {
  // Ottieni il token dal cookie HTTP-only
  const token = request.cookies.get('token')?.value;

  if (!token || typeof token !== 'string') {
    return new NextResponse(JSON.stringify({ message: 'Token non fornito o non valido' }), { status: 401 });
  }

  try {
    // Verifica il token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ottieni il QR code dal corpo della richiesta
    const { qrCode } = await request.json();
    console.log('Verificando QR code:', qrCode);

    // Decodifica il QR code JSON
    const qrData = JSON.parse(qrCode);
    const userId = qrData.userId;
    const productId = qrData.productId;

    // Avvia una transazione SQL
    await pool.query('BEGIN');

    // Verifica se l'acquisto esiste nella tabella purchases
    const purchaseResult = await pool.query('SELECT * FROM purchases WHERE user_id = $1 AND product_id = $2', [userId, productId]);

    if (purchaseResult.rows.length === 0) {
      await pool.query('ROLLBACK');  // Se non ci sono risultati, annulla la transazione
      return new NextResponse(JSON.stringify({ message: 'QR Code non valido o non associato a nessun prodotto.' }), { status: 404 });
    }

    // Eliminazione del QR code dalla tabella purchases
    await pool.query('DELETE FROM purchases WHERE user_id = $1 AND product_id = $2', [userId, productId]);

    // Inserimento della transazione nella tabella transactions
    await pool.query(
      'INSERT INTO transactions (user_id, points, transaction_type, amount, created_at, product_id) VALUES ($1, $2, $3, $4, NOW(), $5)',
      [userId, 10, 'purchase', 15, productId]
    );

    // Recupera i dettagli del prodotto, incluso l'URL dell'immagine
    const productDetailsResult = await pool.query('SELECT name, points, image_url FROM products WHERE id = $1', [productId]);

    if (productDetailsResult.rows.length === 0) {
      await pool.query('ROLLBACK');  // Se il prodotto non è trovato, annulla la transazione
      return new NextResponse(JSON.stringify({ message: 'Prodotto non trovato.' }), { status: 404 });
    }

    // Conferma la transazione SQL
    await pool.query('COMMIT');

    // Restituisci i dettagli del prodotto insieme all'immagine
    return new NextResponse(JSON.stringify({
      message: 'QR Code verificato e transazione registrata con successo',
      productDetails: productDetailsResult.rows[0],  // Include name, points, image_url
    }), { status: 200 });
  } catch (error) {
    // Se c'è un errore, annulla la transazione
    await pool.query('ROLLBACK');
    console.error('Errore durante la verifica del QR code:', error);
    return new NextResponse(JSON.stringify({ message: 'Errore durante la verifica del QR code.' }), { status: 500 });
  }
}
