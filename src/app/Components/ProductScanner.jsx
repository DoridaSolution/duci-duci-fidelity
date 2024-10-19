'use client';

import React, { useState } from 'react';
import QrScanner from 'react-qr-scanner';

const QrCodeScanner = () => {
  const [qrCodeData, setQrCodeData] = useState('');
  const [productInfo, setProductInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isScanning, setIsScanning] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleScan = async (data) => {
    if (data) {
      const qrCodeText = data.text;
      setIsScanning(false); // Chiudi lo scanner quando il QR code viene letto
      setQrCodeData(qrCodeText); // Salva i dati del QR code
      await verifyQrCode(qrCodeText);
    }
  };

  const handleError = (err) => {
    console.error('Errore durante la scansione del QR code:', err);
    setErrorMessage('Errore durante la scansione del QR code.');
  };

  const verifyQrCode = async (qrCode) => {
    setLoading(true);
    try {
      const response = await fetch('/api/users/verifyQrCode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ qrCode }),
      });

      if (response.ok) {
        const data = await response.json();
        setProductInfo(data.productDetails);
        setErrorMessage('');
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Verifica fallita.');
      }
    } catch (error) {
      console.error('Errore nella verifica del QR code:', error);
      setErrorMessage('Errore nella verifica del QR code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-pink-200 text-fuchsia-900 font-sans p-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center text-fuchsia-900 mb-4">Scannerizza il QR Code</h1>
        
        <button
          onClick={() => setIsScanning(!isScanning)} 
          className="w-full mb-4 bg-fuchsia-500 text-white py-2 rounded-md hover:bg-fuchsia-600 transition duration-200"
        >
          {isScanning ? 'Stop Scanning' : 'Start Scanning'}
        </button>

        {isScanning && (
          <QrScanner
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={{ width: '100%', marginBottom: '1rem' }}
          />
        )}

        {loading && <p className="mt-4 text-center">Verifica in corso...</p>}
        {errorMessage && <p className="text-red-500 mt-4 text-center">{errorMessage}</p>}
        {productInfo && (
  <div className="mt-4 bg-pink-50 border border-pink-200 p-4 rounded-lg">
    <h2 className="text-xl font-semibold">Dettagli del Prodotto</h2>
    <p><strong>Nome:</strong> {productInfo.name}</p>
    <p><strong>Punti:</strong> {productInfo.points}</p>
    {productInfo.image_url && (
      <img
        src={productInfo.image_url}
        alt={`Immagine del prodotto ${productInfo.name}`}
        className="w-full h-auto mt-4 rounded-lg shadow-md"
      />
    )}
  </div>
)}

      </div>
    </div>
  );
};

export default QrCodeScanner;
