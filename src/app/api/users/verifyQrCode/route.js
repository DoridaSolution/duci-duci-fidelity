import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { pool } from '../../../lib/db';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Configura il client S3
const s3 = new S3Client({
  region: 'eu-north-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Funzione per generare l'URL firmato della foto
async function getSignedPhotoUrl(photoKey) {
  if (!photoKey) return null;
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: photoKey,
    });
    // Genera l'URL firmato con validità di 1 ora
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
    return signedUrl;
  } catch (error) {
    console.error('Errore durante la generazione dell\'URL firmato:', error);
    return null;
  }
}

export async function POST(request) {
  // Ottieni il token dal cookie HTTP-only
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

    // Ottieni il QR code dal corpo della richiesta
    const { qrCode } = await request.json();
    console.log('Verificando QR code:', qrCode);

    // Decodifica il QR code JSON
    const qrData = JSON.parse(qrCode);
    const userId = qrData.userId;
    const productId = qrData.productId;
    const purchaseId = qrData.purchaseId;

    // Avvia una transazione SQL
    await pool.query('BEGIN');

    // Verifica se l'acquisto esiste nella tabella purchases tramite `purchaseId`
    const purchaseResult = await pool.query(
      'SELECT * FROM purchases WHERE id = $1 AND user_id = $2 AND product_id = $3',
      [purchaseId, userId, productId]
    );

    if (purchaseResult.rows.length === 0) {
      await pool.query('ROLLBACK');
      return new NextResponse(JSON.stringify({ message: 'QR Code non valido o non associato a nessun prodotto.' }), { status: 404 });
    }

    // Recupera i dettagli del prodotto (nome, punti, immagine) e i dettagli dell'utente (nome e foto)
    const productResult = await pool.query(
      `SELECT p.name AS product_name, p.points, p.image_url, u.name AS user_name, u.photo
       FROM products p
       JOIN users u ON u.id = $1
       WHERE p.id = $2`,
      [userId, productId]
    );

    if (productResult.rows.length === 0) {
      await pool.query('ROLLBACK');
      return new NextResponse(JSON.stringify({ message: 'Prodotto non trovato.' }), { status: 404 });
    }

    const { product_name, points, image_url, user_name, photo } = productResult.rows[0];

    // Firma l'URL della foto dell'utente
    const photoKey = photo ? photo.split('/').pop() : null; // Estrai il nome del file dalla URL
    const signedPhotoUrl = await getSignedPhotoUrl(photoKey);

    // Eliminazione del QR code dalla tabella purchases tramite `purchaseId`
    await pool.query('DELETE FROM purchases WHERE id = $1', [purchaseId]);

    // Inserimento della transazione nella tabella transactions
    await pool.query(
      'INSERT INTO transactions (user_id, points, transaction_type, amount, created_at, product_id) VALUES ($1, $2, $3, $4, NOW(), $5)',
      [userId, points, 'purchase', purchaseResult.rows[0].amount, productId]
    );

    // Conferma la transazione SQL
    await pool.query('COMMIT');

    // Restituisci i dettagli del prodotto e dell'utente, inclusa la foto firmata
    return new NextResponse(JSON.stringify({
      message: 'QR Code verificato e transazione registrata con successo',
      productDetails: {
        name: product_name,
        points,
        image_url,
        user_name,
        photo: signedPhotoUrl, // URL firmato della foto
      }
    }), { status: 200 });
  } catch (error) {
    // Se c'è un errore, annulla la transazione
    await pool.query('ROLLBACK');
    console.error('Errore durante la verifica del QR code:', error);
    return new NextResponse(JSON.stringify({ message: 'Errore durante la verifica del QR code.' }), { status: 500 });
  }
}
