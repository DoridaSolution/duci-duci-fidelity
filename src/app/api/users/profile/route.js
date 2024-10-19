import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { pool } from '../../../lib/db';  // Assicurati che il percorso sia corretto

export async function GET(request) {
  // Leggi il token dai cookie
  const cookieToken = request.cookies.get('token'); // Usa il cookie 'token'

  if (!cookieToken || !cookieToken.value) {
    return new NextResponse(JSON.stringify({ message: 'Token non fornito' }), { status: 401 });
  }

  try {
    // Verifica e decodifica il token
    const decoded = jwt.verify(cookieToken.value, process.env.JWT_SECRET);
    const userIdFromToken = decoded.userId; // Ottieni l'ID utente dal token

    // Recupera i dati dell'utente dal database
    const userResult = await pool.query('SELECT points, qr_code, name FROM users WHERE id = $1', [userIdFromToken]);

    if (userResult.rows.length === 0) {
      return new NextResponse(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }

    const user = userResult.rows[0];

    // Recupera i prodotti dal database
    const productsResult = await pool.query('SELECT * FROM products');
    const products = productsResult.rows;

    // Restituisci le informazioni dell'utente e i prodotti
    return new NextResponse(JSON.stringify({ 
      points: user.points, 
      qr_code: user.qr_code, 
      name: user.name, 
      products 
    }), { status: 200 });
  } catch (error) {
    console.error('Errore nella verifica del token:', error);
    return new NextResponse(JSON.stringify({ message: 'Token non valido' }), { status: 403 });
  }
}
