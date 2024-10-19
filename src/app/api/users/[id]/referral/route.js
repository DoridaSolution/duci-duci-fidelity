import { NextResponse } from 'next/server';
import { pool } from '../../../../lib/db';

export async function POST(request, { params }) {
  const { inviter_id, invited_email } = await request.json();
  const { id } = params;

  try {
    // Trova l'ID dell'invitato
    const invitedResult = await pool.query('SELECT id FROM users WHERE email = $1', [invited_email]);

    if (invitedResult.rows.length === 0) {
      return new NextResponse(JSON.stringify({ message: 'Utente invitato non trovato.' }), { status: 404 });
    }

    const invited_id = invitedResult.rows[0].id;

    // Inserisci il record di referral
    await pool.query(
      'INSERT INTO referrals (inviter_id, invited_id) VALUES ($1, $2)',
      [inviter_id, invited_id]
    );

    return new NextResponse(JSON.stringify({ message: 'Referral registrato con successo' }), { status: 201 });
  } catch (error) {
    console.error('Errore durante la registrazione del referral:', error);
    return new NextResponse(JSON.stringify({ message: 'Errore del server' }), { status: 500 });
  }
}
