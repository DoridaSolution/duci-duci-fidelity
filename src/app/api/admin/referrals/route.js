import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken'; // Per decodificare il token JWT
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

    // Recupera i dati sui referral dal database
    const result = await pool.query(`
      SELECT r.*, u1.name AS referrer_name, u2.name AS referred_user_name 
      FROM referrals r
      JOIN users u1 ON r.referrer_id = u1.id
      JOIN users u2 ON r.referred_user_id = u2.id
      ORDER BY r.created_at DESC
    `);

    return new NextResponse(JSON.stringify(result.rows), { status: 200 });
  } catch (error) {
    console.error('Errore durante il recupero dei referral:', error);
    return new NextResponse(JSON.stringify({ message: 'Errore nel recupero dei referral.' }), { status: 500 });
  }
}
