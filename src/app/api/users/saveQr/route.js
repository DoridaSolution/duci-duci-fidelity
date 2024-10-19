import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';  // Per la gestione del JWT
import { pool } from '../../../lib/db';  // Collegamento al database
import QRCode from 'qrcode';  // Libreria per generare QR code

export async function POST(request) {
  // Ottieni il token dal cookie HTTP-only
  const token = request.cookies.get('token')?.value;

  if (!token || typeof token !== 'string') {
    return new NextResponse(JSON.stringify({ message: 'Token non fornito o non valido' }), { status: 401 });
  }

  try {
    // Verifica il token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userIdFromToken = decoded.userId;  // Estrarre l'ID utente dal token JWT

    // Estrazione dei dati dal corpo della richiesta (productId)
    const { productId } = await request.json();

    // Verifica che productId sia fornito
    if (!productId) {
      return new NextResponse(JSON.stringify({ message: 'Dati mancanti: productId' }), { status: 400 });
    }

    // Genera un QR code con userId e productId
    const qrData = { userId: userIdFromToken, productId };
    const qrCodeGenerated = await QRCode.toDataURL(JSON.stringify(qrData));

    // Salva il QR code nella tabella purchases
    const purchaseResult = await pool.query(
      'UPDATE purchases SET qr_code = $1 WHERE user_id = $2 AND product_id = $3 RETURNING *',
      [qrCodeGenerated, userIdFromToken, productId]
    );

    // Controlla se l'acquisto esiste
    if (purchaseResult.rows.length === 0) {
      return new NextResponse(JSON.stringify({ message: 'Acquisto non trovato.' }), { status: 404 });
    }

    // Risposta di successo con il QR code generato
    return new NextResponse(JSON.stringify({
      message: 'QR Code generato e salvato con successo',
      qrCode: qrCodeGenerated,
      purchase: purchaseResult.rows[0]
    }), { status: 200 });
  } catch (error) {
    console.error('Errore durante il salvataggio del QR code:', error);
    return new NextResponse(JSON.stringify({ message: 'Errore durante il salvataggio del QR code' }), { status: 500 });
  }
}
