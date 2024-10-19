'use client';

import { useState } from 'react';

export default function RegisterForm() {
  const [form, setForm] = useState({ name: '', email: '', password: '', referralCode: '' });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),  // Invia il form con referralCode incluso
    });

    const data = await res.json();
    if (res.ok) {
      setMessage('Registration successful! Redirecting...');
      // Reindirizza l'utente alla pagina di login dopo 1,5 secondi
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
    } else {
      setMessage(data.error || 'Registration failed, please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-pink-700">Name</label>
        <input
          type="text"
          id="name"
          placeholder="Enter your name"
          className="input input-bordered w-full"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-pink-700">Email</label>
        <input
          type="email"
          id="email"
          placeholder="Enter your email"
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
          placeholder="Create a password"
          className="input input-bordered w-full"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
      </div>

      <div>
        <label htmlFor="referralCode" className="block text-sm font-medium text-pink-700">Referral Code (Optional)</label>
        <input
          type="text"
          id="referralCode"
          placeholder="Enter referral code if you have one"
          className="input input-bordered w-full"
          onChange={(e) => setForm({ ...form, referralCode: e.target.value })}
        />
      </div>

      <div>
        <button
          type="submit"
          className="btn btn-primary w-full bg-pink-500 hover:bg-pink-600 text-white"
        >
          Register
        </button>
      </div>

      {message && (
        <p className="text-center text-red-500 mt-2">{message}</p>
      )}
    </form>
  );
}
