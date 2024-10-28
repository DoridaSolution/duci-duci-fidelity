import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import jwt from 'jsonwebtoken';
import { pool } from '../../../lib/db';  // Assicurati che il percorso sia corretto

// Configura AWS S3 con SDK v3
const s3 = new S3Client({
  region: 'eu-north-1', // Assicurati di utilizzare 'eu-north-1' come regione corretta
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function POST(request) {
  // Leggi il token dai cookie
  const cookieToken = request.cookies.get('token'); // Usa il cookie 'token'

  if (!cookieToken || !cookieToken.value) {
    return new NextResponse(JSON.stringify({ message: 'Token non fornito' }), { status: 401 });
  }

  try {
    // Verifica e decodifica il token
    const decoded = jwt.verify(cookieToken.value, process.env.JWT_SECRET);
    const userIdFromToken = decoded.userId; // Ottieni l'ID utente dal token

    // Recupera i dati dal form
    const data = await request.formData();
    const file = data.get('photo');

    if (!file) {
      return new NextResponse(JSON.stringify({ message: 'Dati mancanti.' }), { status: 400 });
    }

    // Configura i parametri di caricamento per S3
    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${Date.now()}-${file.name}`,
      Body: Buffer.from(await file.arrayBuffer()), // Converti il file in Buffer
      ACL: 'private',
      ContentType: file.type,
    };

    // Carica il file su S3
    const result = await s3.send(new PutObjectCommand(uploadParams));
    const photoUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.eu-north-1.amazonaws.com/${uploadParams.Key}`;

    // Salva l'URL della foto nel database per l'utente corrente
    const updateUser = await pool.query(
      'UPDATE users SET photo = $1 WHERE id = $2 RETURNING *',
      [photoUrl, userIdFromToken]
    );

    if (updateUser.rowCount === 0) {
      return new NextResponse(JSON.stringify({ message: 'Utente non trovato.' }), { status: 404 });
    }

    return new NextResponse(JSON.stringify({ message: 'Foto caricata con successo!', photoUrl }), { status: 200 });
  } catch (error) {
    console.error('Errore durante il caricamento della foto su S3:', error);
    return new NextResponse(JSON.stringify({ message: 'Errore durante il caricamento della foto.' }), { status: 500 });
  }
}
