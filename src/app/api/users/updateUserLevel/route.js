import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { pool } from '../../../lib/db'; // Assicurati che il percorso sia corretto

export async function POST(request) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return new NextResponse(JSON.stringify({ message: 'Token non fornito' }), { status: 401 });
  }

  try {
    // Verifica il token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId; // Supponiamo che l'ID utente sia presente nel token

    // Recupero dei punti accumulati dall'utente dalle transazioni
    const pointsResult = await pool.query(`
      SELECT COALESCE(SUM(points), 0) AS total_points
      FROM transactions
      WHERE user_id = $1
    `, [userId]);

    const totalPoints = pointsResult.rows[0].total_points;

    // Determinare il livello dell'utente
    let newLevel = 'Bronze';
    if (totalPoints >= 500) {
      newLevel = 'Gold';
    } else if (totalPoints >= 100) {
      newLevel = 'Silver';
    }

    // Aggiornare i dati dell'utente nella tabella users
    await pool.query(`
      UPDATE users
      SET level = $1
      WHERE id = $2
    `, [newLevel, userId]);

    return new NextResponse(JSON.stringify({ totalPoints, level: newLevel }), { status: 200 });
  } catch (error) {
    console.error('Errore durante l\'aggiornamento dei punti e del livello:', error);
    return new NextResponse(JSON.stringify({ message: 'Token non valido' }), { status: 403 });
  }
}
