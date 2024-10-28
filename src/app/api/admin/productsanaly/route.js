import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { pool } from '../../../lib/db';

export async function GET(request) {
  // Ottieni il token dai cookie HTTP-only
  const token = request.cookies.get('token')?.value;

  if (!token || typeof token !== 'string') {
    return new NextResponse(JSON.stringify({ message: 'Token non fornito o non valido' }), { status: 401 });
  }

  try {
    // Verifica il token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Controlla se l'utente ha il ruolo di admin
    if (decoded.role !== 'admin') {
      return new NextResponse(JSON.stringify({ message: 'Accesso negato. Solo l\'amministratore può effettuare questa operazione.' }), { status: 403 });
    }

    // Recupera le statistiche sui prodotti
    const topProducts = await pool.query(`
      SELECT p.name, COUNT(p.id) AS purchase_count, AVG(r.rating) AS avg_rating
      FROM purchases pr
      JOIN products p ON pr.product_id = p.id
      LEFT JOIN reviews r ON r.product_id = p.id
      GROUP BY p.name 
      ORDER BY purchase_count DESC 
      LIMIT 10
    `);

    // Recupera i prodotti con alti tassi di conversione e sconti applicati
    const highConversionProducts = await pool.query(`
      SELECT p.name, COUNT(pr.id) AS purchase_count, AVG(pr.discount_applied) AS avg_discount
      FROM purchases pr
      JOIN products p ON pr.product_id = p.id
      GROUP BY p.name 
      HAVING AVG(pr.discount_applied) > 0
      ORDER BY purchase_count DESC 
      LIMIT 5
    `);

    // Recupera prodotti con tendenze future (esempio di previsione basata sui dati recenti)
    // Nota: Questa logica potrebbe essere migliorata utilizzando strumenti di analisi predittiva esterni
    const trendingProducts = await pool.query(`
      SELECT p.name, COUNT(pr.id) AS purchase_count_last_week
      FROM purchases pr
      JOIN products p ON pr.product_id = p.id
      WHERE pr.created_at >= NOW() - INTERVAL '1 WEEK'
      GROUP BY p.name
      ORDER BY purchase_count_last_week DESC 
      LIMIT 5
    `);

    return new NextResponse(JSON.stringify({
      topProducts: topProducts.rows,
      highConversionProducts: highConversionProducts.rows,
      trendingProducts: trendingProducts.rows
    }), { status: 200 });
  } catch (error) {
    console.error('Errore durante il recupero delle statistiche sui prodotti:', error);
    return new NextResponse(JSON.stringify({ message: 'Errore durante il recupero delle statistiche sui prodotti' }), { status: 500 });
  }
}
