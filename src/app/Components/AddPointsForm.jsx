'use client';

import React, { useState, useEffect } from 'react';
import QrScanner from 'react-qr-scanner';

const AdminDashboard = () => {
  const [userEmail, setUserEmail] = useState('');
  const [amountSpent, setAmountSpent] = useState(0);
  const [message, setMessage] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleScan = (data) => {
    if (data) {
      const email = data.text;
      setUserEmail(email);
      fetchUserData(email);
      setIsScanning(false);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  const fetchUserData = async (email) => {
    const token = localStorage.getItem('token');

    const res = await fetch(`/api/users?email=${email}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (res.ok) {
      setUserData(data);
    } else {
      setMessage(data.message || 'Errore durante il recupero dei dati dell\'utente.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const pointsToAdd = Math.floor(amountSpent / 10);
    const token = localStorage.getItem('token');

    const res = await fetch(`/api/users/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ email: userEmail, pointsToAdd }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage('Punti aggiunti con successo!');
      setUserEmail('');
      setAmountSpent(0);
      setUserData(null);
    } else {
      setMessage(data.message || 'Errore durante l\'aggiunta dei punti.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-pink-200 text-fuchsia-900 font-sans p-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center text-fuchsia-900 mb-4">Admin Dashboard</h1>
        
        <button 
          onClick={() => setIsScanning(!isScanning)} 
          className="w-full mb-4 bg-fuchsia-500 text-white py-2 rounded-md hover:bg-fuchsia-600 transition duration-200"
        >
          {isScanning ? 'Stop Scanning' : 'Scan QR Code'}
        </button>

        {isScanning && (
          <QrScanner
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={{ width: '100%', marginBottom: '1rem' }}
          />
        )}

        {userData && (
          <div className="bg-pink-50 border border-pink-200 p-4 rounded-lg mb-4">
            <h2 className="text-xl font-semibold">User Details</h2>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Points:</strong> {userData.points}</p>
            <p><strong>QR Code:</strong></p>
            <img src={userData.qr_code} alt="QR Code" className="w-32 h-32" />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div>
            <label htmlFor="userEmail" className="block text-sm font-medium text-pink-700">User Email</label>
            <input
              type="text"
              id="userEmail"
              value={userEmail}
              placeholder="User Email from QR Code"
              className="input input-bordered w-full"
              readOnly
            />
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-pink-700">Amount Spent (€)</label>
            <input
              type="number"
              id="amount"
              value={amountSpent}
              onChange={(e) => setAmountSpent(Number(e.target.value))}
              placeholder="Enter amount spent"
              className="input input-bordered w-full"
              required
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-fuchsia-500 hover:bg-fuchsia-600 text-white py-2 rounded-md"
            >
              Add Points
            </button>
          </div>

          {message && (
            <p className="text-center text-red-500 mt-2">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;
