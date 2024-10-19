'use client';

import { useState } from 'react';

export default function LogoutButton() {
  const [message, setMessage] = useState('');

  const handleLogout = async () => {
    const res = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',  // Include i cookie nella richiesta
    });

    const data = await res.json();
    if (res.ok) {
      setMessage('Logout effettuato con successo! Reindirizzamento in corso...');
      setTimeout(() => {
        window.location.href = '/Login'; // Reindirizza alla pagina di login o home
      }, 1500);
    } else {
      setMessage('Errore durante il logout, riprova.');
    }
  };

  return (
    <div>
      <button
        onClick={handleLogout}
        className="btn btn-primary w-full bg-red-500 hover:bg-red-600 text-white"
      >
        Logout
      </button>
      {message && (
        <p className="text-center text-green-500 mt-2">{message}</p>
      )}
    </div>
  );
}
