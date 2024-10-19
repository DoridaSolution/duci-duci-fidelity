import { NextResponse } from 'next/server';

export async function POST() {
  const response = new NextResponse(JSON.stringify({ message: 'Logout effettuato con successo' }), { status: 200 });

  // Elimina il cookie HTTP-only impostando maxAge a 0
  response.cookies.set('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',  // Solo HTTPS in produzione
    maxAge: 0,  // Elimina immediatamente il cookie
    sameSite: 'strict',
  });

  return response;
}
