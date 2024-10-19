import { NextResponse } from 'next/server';
import { pool } from '../../../../lib/db';

export async function PATCH(request, { params }) {
  const { invited_id, points } = await request.json();
  const { id: inviter_id } = params;

  try {
    // Controlla se è il primo acquisto
    const referralResult = await pool.query(
      'SELECT is_first_purchase FROM referrals WHERE inviter_id = $1 AND invited_id = $2',
      [inviter_id, invited_id]
    );

    if (referralResult.rows.length === 0) {
      return new NextResponse(JSON.stringify({ message: 'Referral non trovato.' }), { status: 404 });
    }

    let bonusPoints = 0;

    if (referralResult.rows[0].is_first_purchase && points >= 5) {
      // Se è il primo acquisto, aggiungi 10 punti
      bonusPoints = 10;
      // Aggiorna is_first_purchase a FALSE
      await pool.query(
        'UPDATE referrals SET is_first_purchase = FALSE WHERE inviter_id = $1 AND invited_id = $2',
        [inviter_id, invited_id]
      );
    } else {
      // Aggiungi 1 punto per ogni acquisto successivo
      bonusPoints = 1;
    }

    // Aggiungi i punti all'invitante
    await pool.query('UPDATE users SET points = points + $1 WHERE id = $2', [bonusPoints, inviter_id]);

    // Aggiungi i punti all'invitato
    await pool.query('UPDATE users SET points = points + 5 WHERE id = $1', [invited_id]);

    return new NextResponse(JSON.stringify({ message: 'Punti referral aggiunti con successo' }), { status: 200 });
  } catch (error) {
    console.error('Errore durante l\'aggiunta dei punti referral:', error);
    return new NextResponse(JSON.stringify({ message: 'Errore del server' }), { status: 500 });
  }
}
