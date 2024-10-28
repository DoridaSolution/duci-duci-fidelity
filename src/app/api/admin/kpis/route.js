// /src/pages/api/admin/dashboard/kpis.js
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

    // Query per i KPI
    const { rows: newUsers } = await pool.query("SELECT COUNT(*) AS new_users FROM users WHERE created_at >= NOW() - INTERVAL '1 MONTH'");
    const { rows: totalPoints } = await pool.query("SELECT SUM(points) AS total_points FROM transactions WHERE transaction_type = 'earn'");
    const { rows: transactions } = await pool.query("SELECT COUNT(*) AS total_transactions FROM transactions");
    const { rows: topUsers } = await pool.query("SELECT name, total_points FROM users ORDER BY total_points DESC LIMIT 5");
    const { rows: topProducts } = await pool.query(`
      SELECT p.name, COUNT(p.id) AS purchase_count 
      FROM purchases pr
      JOIN products p ON pr.product_id = p.id
      GROUP BY p.name 
      ORDER BY purchase_count DESC 
      LIMIT 5
    `);

    // Formatta i dati per il frontend
    const kpiData = {
      newUsers: parseInt(newUsers[0].new_users, 10),
      totalPoints: parseInt(totalPoints[0].total_points, 10),
      totalTransactions: parseInt(transactions[0].total_transactions, 10),
      topUsers,
      topProducts,
    };

    // Restituisce i KPI al frontend
    return new NextResponse(JSON.stringify(kpiData), { status: 200 });
  } catch (error) {
    console.error('Errore durante il recupero dei KPI:', error);
    return new NextResponse(JSON.stringify({ message: 'Errore durante il recupero dei KPI' }), { status: 500 });
  }
}
