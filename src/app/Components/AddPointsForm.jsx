'use client';

import React, { useState, useEffect, useRef } from 'react';
import QrScanner from 'react-qr-scanner';

const AdminDashboard = () => {
  const [userEmail, setUserEmail] = useState('');
  const [amountSpent, setAmountSpent] = useState(0);
  const [message, setMessage] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pointsToAdd, setPointsToAdd] = useState(0);

  // Ref per l'elemento audio
  const successSoundRef = useRef(null);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!userEmail) {
      setMessage('Errore: Nessuna email utente trovata. Scannerizza un codice valido.');
      return;
    }

    const calculatedPoints = Math.floor(amountSpent / 10);
    setPointsToAdd(calculatedPoints);
    setIsModalOpen(true); // Mostra il modale di conferma
  };

  const confirmAddPoints = async () => {
    if (!userEmail) {
      setMessage('Errore: Nessuna email utente trovata. Scannerizza un codice valido.');
      return;
    }

    const token = localStorage.getItem('token');

    const res = await fetch(`/api/users/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email: userEmail, pointsToAdd }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage('Punti aggiunti con successo!');
      // Riproduci il suono di successo
      successSoundRef.current.play();
      // Reset degli stati
      resetStates();
    } else {
      setMessage(data.message || 'Errore durante l\'aggiunta dei punti.');
    }
    setIsModalOpen(false); // Chiudi il modale
  };

  const cancelAddPoints = () => {
    setIsModalOpen(false); // Chiudi il modale senza aggiungere punti
  };

  const resetStates = () => {
    setUserEmail('');
    setAmountSpent(0);
    setUserData(null);
    setPointsToAdd(0);
    setIsScanning(false);
    setMessage('');
  };

  return (
    <div className="">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center text-fuchsia-900 mb-4">Checkout points</h1>
        
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
            <label htmlFor="userEmail" className="block text-sm font-medium text-pink-700 d-none">User Email</label>
            <input
              type="text"
              id="userEmail"
              value={userEmail}
              placeholder="User Email from QR Code"
              className="input input-bordered w-full d-none"
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

        {/* Modale di Conferma */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 text-gray-900">
            <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
              <h2 className="text-2xl font-bold text-fuchsia-700 mb-4">Conferma Aggiunta Punti</h2>
              <p className="mb-2">Email Utente: {userEmail}</p>
              <p className="mb-2">Importo Speso: €{amountSpent}</p>
              <p className="mb-4">Punti da Aggiungere: {pointsToAdd}</p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={confirmAddPoints}
                  className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md"
                >
                  Conferma
                </button>
                <button
                  onClick={cancelAddPoints}
                  className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md"
                >
                  Annulla
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Elemento audio per il suono di successo */}
        <audio ref={successSoundRef} src="/success.mp3" />
      </div>
    </div>
  );
};

export default AdminDashboard;
