import { pool } from '../../../lib/db';
import bcrypt from 'bcrypt';
import QRCode from 'qrcode';
import jwt from 'jsonwebtoken';  // Per la gestione dei referral e sicurezza extra

const rateLimit = new Map(); // Mappa per il rate limiting

export async function POST(request) {
  try {
    const { name, email, password, referralCode } = await request.json();

    // Rate limiting per prevenire attacchi di forza bruta
    const ip = request.headers.get('x-forwarded-for') || request.ip;
    const attempts = rateLimit.get(ip) || 0;

    if (attempts >= 5) {
      return new Response(JSON.stringify({ error: 'Troppi tentativi, riprova più tardi.' }), { status: 429 });
    }

    // Validazione dell'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: 'Email non valida.' }), { status: 400 });
    }

    // Validazione della password (minimo 8 caratteri, almeno un numero e un carattere speciale)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return new Response(JSON.stringify({ error: 'Password non sufficientemente sicura.' }), { status: 400 });
    }

    // Controlla se l'utente esiste già
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      rateLimit.set(ip, attempts + 1);  // Incrementa il conteggio dei tentativi
      return new Response(JSON.stringify({ error: 'Utente già esistente.' }), { status: 400 });
    }

    // Cifra la password in modo sicuro con bcrypt
    const hashedPassword = await bcrypt.hash(password, 12);  // Usa 12 salt round per maggiore sicurezza

    // Genera un identificatore univoco per il QR code (può essere l'email o un ID generato)
    const qrCodeData = email; // Puoi usare un ID univoco generato dal DB
    const qrCode = await QRCode.toDataURL(qrCodeData, {
      color: {
        dark: '#D5006D',  // Colore rosa
        light: '#FFFFFF', // Colore di sfondo bianco
      },
      errorCorrectionLevel: 'H',
      margin: 2,
      scale: 6,
    });

    // Se è presente un referralCode, recupera chi ha effettuato l'invito
    let referredBy = null;
    if (referralCode) {
      const referringUser = await pool.query('SELECT id FROM users WHERE referral_code = $1', [referralCode]);
      if (referringUser.rows.length > 0) {
        referredBy = referringUser.rows[0].id;
      }
    }

    // Genera un codice referral unico per il nuovo utente
    const referralCodeGenerated = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1y' });

    // Inserisci il nuovo utente nel database insieme al codice QR e eventuale referral
    await pool.query(
      'INSERT INTO users (name, email, password, qr_code, referral_code, referred_by) VALUES ($1, $2, $3, $4, $5, $6)',
      [name, email, hashedPassword, qrCode, referralCodeGenerated, referredBy]
    );

    return new Response(JSON.stringify({ message: 'Utente registrato con successo con QR code.' }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Errore durante la registrazione:', error);
    return new Response(JSON.stringify({ error: 'Registrazione fallita.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
