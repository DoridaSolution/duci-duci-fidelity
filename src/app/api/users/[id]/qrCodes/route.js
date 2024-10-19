import { NextResponse } from 'next/server';
import { pool } from '../../../../lib/db'; // Assicurati che il percorso sia corretto

export async function GET(request, { params }) {
  const userId = params.id; // Ottieni l'ID dell'utente dai parametri

  try {
    // Recupera i QR code associati all'utente
    const result = await pool.query('SELECT qr_code, product_id FROM purchases WHERE user_id = $1', [userId]);

    const qrCodes = result.rows; // I QR code recuperati
    return new NextResponse(JSON.stringify(qrCodes), { status: 200 });
  } catch (error) {
    console.error('Errore durante il recupero dei QR code:', error);
    return new NextResponse(JSON.stringify({ message: 'Errore durante il recupero dei QR code.' }), { status: 500 });
  }
}
