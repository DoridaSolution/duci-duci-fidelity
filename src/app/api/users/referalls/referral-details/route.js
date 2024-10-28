// /api/users/referalls/referral-details/route.js
import { NextResponse } from 'next/server';
import { pool } from '../../../../lib/db'; // Assicurati di avere il file di connessione al database
import jwt from 'jsonwebtoken';

export async function GET(request) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Decodifica del token JWT per ottenere l'ID dell'utente
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Ottieni i dettagli del referral dell'utente
    const referralDetailsQuery = `
      SELECT 
        referral_code, 
        points, 
        pending_points 
      FROM users 
      WHERE id = $1
    `;
    const referralDetails = await pool.query(referralDetailsQuery, [userId]);

    // Ottieni gli utenti invitati e verifica la presenza di transazioni valide
    const invitedUsersQuery = `
      SELECT 
        u.id, 
        u.name, 
        u.created_at AS "registrationDate",  -- Cambiato in created_at
        EXISTS (
          SELECT 1 
          FROM transactions 
          WHERE transactions.user_id = u.id 
            AND transactions.transaction_type = 'purchase' 
            AND transactions.amount >= 10
        ) AS "hasPurchased"
      FROM users u
      WHERE u.referred_by = $1
    `;
    const invitedUsers = await pool.query(invitedUsersQuery, [userId]);

    return NextResponse.json({
      referralCode: referralDetails.rows[0].referral_code,
      confirmedPoints: referralDetails.rows[0].points,
      pendingPoints: referralDetails.rows[0].pending_points,
      invitedUsers: invitedUsers.rows
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching referral details:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
