import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import { pool } from '../../../lib/db'; // Assicurati di importare il client del database

const rateLimit = new Map(); // Mappa per il rate limiting

// Funzione per trovare l'utente per email
async function findUserByEmail(email) {
  try {
    const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return res.rows.length ? res.rows[0] : null; // Ritorna l'utente o null se non trovato
  } catch (error) {
    console.error('Errore durante la ricerca dell\'utente:', error);
    return null;
  }
}

// Funzione per generare un token JWT con durata personalizzata
function generateToken(user, rememberMe) {
  try {
    // Imposta una durata del token di 30 giorni se l'utente seleziona "Ricordami", altrimenti 1 ora
    const expiresIn = rememberMe ? '30d' : '1h';
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn });
    console.log('Token generato:', token);  // Logga il token per il debug
    return token;
  } catch (error) {
    console.error('Errore durante la generazione del token JWT:', error);
    return null;
  }
}

export async function POST(request) {
  const { email, password, rememberMe } = await request.json();  // Aggiungi rememberMe nei parametri

  // Controlla il rate limiting
  const ip = request.headers.get('x-forwarded-for') || request.ip;
  const attempts = rateLimit.get(ip) || 0;

  if (attempts >= 5) {
    return new NextResponse(JSON.stringify({ message: 'Troppi tentativi, riprova più tardi' }), { status: 429 });
  }

  // Trova l'utente nel database
  const user = await findUserByEmail(email);
  if (!user) {
    rateLimit.set(ip, attempts + 1); // Incrementa il conteggio dei tentativi
    console.log('Utente non trovato con email:', email);
    return new NextResponse(JSON.stringify({ message: 'Credenziali non valide' }), { status: 401 });
  }

  // Verifica la password con bcrypt
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    rateLimit.set(ip, attempts + 1); // Incrementa il conteggio dei tentativi
    console.log('Password non corretta per email:', email);
    return new NextResponse(JSON.stringify({ message: 'Credenziali non valide' }), { status: 401 });
  }

  // Se l'utente è autenticato, genera il token JWT con la durata scelta
  const token = generateToken(user, rememberMe);
  if (!token) {
    return new NextResponse(JSON.stringify({ message: 'Errore durante la generazione del token' }), { status: 500 });
  }

  // Imposta il token come cookie HTTP-only
  const response = new NextResponse(JSON.stringify({ isAdmin: user.role === 'admin' }), { status: 200 });
  
  response.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: rememberMe ? 30 * 24 * 60 * 60 : 60 * 60, // 30 giorni o 1 ora
    sameSite: 'strict',
  });

  console.log('Login effettuato con successo per utente:', user.email);

  return response;
}
