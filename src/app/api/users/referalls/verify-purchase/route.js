// /api/users/verify-purchase/route.js
import { NextResponse } from 'next/server';
import { pool } from '../../../../lib/db'; // Assicurati di avere il file di connessione al database

export async function POST(request) {
  try {
    const { referredUserId } = await request.json(); // Ottieni l'ID dell'utente invitato
    const token = request.cookies.get('token')?.value; // Recupera il token dai cookie

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verifica l'esistenza di un acquisto dell'utente invitato con importo maggiore o uguale a 10
    const purchase = await pool.query(
      `SELECT * FROM purchases WHERE user_id = $1 AND amount >= 10 LIMIT 1`,
      [referredUserId]
    );

    if (purchase.rows.length === 0) {
      return NextResponse.json({ message: 'No qualifying purchase found' }, { status: 200 });
    }

    // Recupera l'ID del referrer dall'utente invitato
    const referredUser = await pool.query(
      `SELECT referred_by FROM users WHERE id = $1 LIMIT 1`,
      [referredUserId]
    );

    const referrerId = referredUser.rows[0]?.referred_by;

    if (!referrerId) {
      return NextResponse.json({ message: 'No referrer found' }, { status: 404 });
    }

    // Aggiungi 10 punti al referrer e resetta i pending points
    await pool.query(
      `UPDATE users SET points = points + 10 WHERE id = $1`,
      [referrerId]
    );

    // Resetta i punti pending del referrer se hai una colonna per i punti pending
    await pool.query(
      `UPDATE users SET pending_points = 0 WHERE id = $1`,
      [referrerId]
    );

    return NextResponse.json({ message: 'Points awarded to referrer' }, { status: 200 });

  } catch (error) {
    console.error('Error verifying purchase or awarding points:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
