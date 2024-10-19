import { NextResponse } from 'next/server';
import { pool } from '../../lib/db';  // Assicurati che il percorso sia corretto

export async function GET(request) {
  try {
    // Recupera tutti i prodotti dal database
    const result = await pool.query('SELECT id, name, price, description, image_url, points FROM products');

    // Verifica se ci sono prodotti
    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'No products found' }, { status: 404 });
    }

    // Restituisci i prodotti
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('Error retrieving products:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
