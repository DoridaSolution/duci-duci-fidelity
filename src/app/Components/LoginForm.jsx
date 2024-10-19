'use client';

import { useState, useEffect } from 'react';

export default function LoginForm() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false); // Stato per la checkbox "Ricordami"
  const [message, setMessage] = useState('');

  // Controllo iniziale per verificare se l'utente è già loggato
  useEffect(() => {
    const checkIfLoggedIn = async () => {
      const res = await fetch('/api/auth/check', {
        method: 'GET',
        credentials: 'include',  // Include i cookie nella richiesta
      });

      if (res.ok) {
        const data = await res.json();
        if (data.isLoggedIn) {
          // Se l'utente è loggato, reindirizza alla dashboard o alla home page
          if (data.isAdmin) {
            window.location.href = '/dashboard';
          } else {
            window.location.href = '/';
          }
        }
      }
    };

    checkIfLoggedIn();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, rememberMe }),  // Includi la preferenza "Ricordami"
      credentials: 'include',  // Include i cookie nella richiesta
    });

    const data = await res.json();
    if (res.ok) {
      setMessage('Login effettuato con successo! Reindirizzamento in corso...');
      
      // Verifica il ruolo dell'utente e reindirizza in base a esso
      if (data.isAdmin) {
        window.location.href = '/dashboard'; // Reindirizza alla dashboard per admin
      } else {
        window.location.href = '/'; // Reindirizza alla homepage per utenti normali
      }
    } else {
      setMessage(data.message || 'Login fallito, riprova.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-pink-700">Email</label>
        <input
          type="email"
          id="email"
          placeholder="Inserisci la tua email"
          className="input input-bordered w-full"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-pink-700">Password</label>
        <input
          type="password"
          id="password"
          placeholder="Inserisci la tua password"
          className="input input-bordered w-full"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="rememberMe"
          className="mr-2"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
        <label htmlFor="rememberMe" className="text-sm font-medium text-pink-700">Ricordami</label>
      </div>

      <div>
        <button
          type="submit"
          className="btn btn-primary w-full bg-pink-500 hover:bg-pink-600 text-white"
        >
          Login
        </button>
      </div>

      {message && (
        <p className="text-center text-red-500 mt-2">{message}</p>
      )}
    </form>
  );
}
