// /src/pages/api/referrals/generate.js
import { getCookie } from 'cookies-next';
import { v4 as uuidv4 } from 'uuid';
import db from '../../../../lib/db'; // Supponendo che tu abbia una connessione DB gestita qui

export default async function handler(req, res) {
  // Metodo: POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Verifica il token nei cookie
  const token = getCookie('authToken', { req, res });
  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  // Estrarre l'ID dell'utente dal token (supponendo che tu abbia una funzione per farlo)
  const userId = extractUserIdFromToken(token); // Definisci questa funzione a parte
  
  try {
    // Genera un codice di referral univoco se non esiste già
    let referralCode = uuidv4();
    await db.referrals.create({
      data: {
        userId,
        referralCode,
      },
    });

    const referralLink = `${process.env.NEXT_PUBLIC_BASE_URL}/register?ref=${referralCode}`;

    return res.status(201).json({ referralLink });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
