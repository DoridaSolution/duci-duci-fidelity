'use client';

import React, { useRef, useState } from 'react';
import QrScanner from 'react-qr-scanner';
import AlertModal from '../Components/AlertModal'; // Importiamo il componente AlertModal

const QrCodeScanner = () => {
  const [qrCodeData, setQrCodeData] = useState('');
  const [productInfo, setProductInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const successSoundRef = useRef(null);

  // Funzione per gestire l'erogazione gratuita del prodotto dopo la verifica
  const handleProvideFreeProduct = () => {
    setAlertMessage(`Il prodotto ${productInfo.name} è stato fornito con successo all'utente ${productInfo.user_name}.`);
    setAlertType('successo');
    setShowAlert(true);
  };

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
        setAlertMessage(`QR Code verificato correttamente. Puoi ora fornire il prodotto gratuitamente.`);
        setAlertType('successo');
        successSoundRef.current.play();

        setShowAlert(true);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Verifica fallita.');
        setAlertMessage('Verifica fallita. Impossibile fornire il prodotto.');
        setAlertType('errore');
        setShowAlert(true);
      }
    } catch (error) {
      console.error('Errore nella verifica del QR code:', error);
      setErrorMessage('Errore nella verifica del QR code.');
      setAlertMessage('Errore nella verifica del QR code.');
      setAlertType('errore');
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  // Funzione per chiudere l'alert
  const closeAlert = () => setShowAlert(false);

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6 h-100">
      <h1 className="text-3xl font-bold text-center text-fuchsia-900 mb-4">Controllo acquisto</h1>

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
  <div className="mt-4 space-y-4">
    <h2 className="text-2xl font-bold text-fuchsia-900">Dettagli del Prodotto</h2>
    <div className="flex justify-between items-center">
      <p className="text-gray-700"><strong>Prodotto:</strong> {productInfo.name}</p>
      <p className="text-gray-700"><strong>Punti:</strong> {productInfo.points}</p>
    </div>
    <div className="flex justify-between items-center">
      <p className="text-gray-700"><strong>Utente:</strong> {productInfo.user_name}</p>
      <p className="text-gray-700"><strong>Quantità:</strong> 1</p>
    </div>
    {productInfo.photo && (
      <div className="mt-4">
        <img
          src={productInfo.photo}
          alt={`Immagine dell'utente ${productInfo.user_name}`}
          className="w-full h-48 object-cover rounded-lg shadow-md"
        />
      </div>
    )}
    {productInfo.image_url && (
      <div className="mt-4">
        <img
          src={productInfo.image_url}
          alt={`Immagine del prodotto ${productInfo.name}`}
          className="w-full h-48 object-cover rounded-lg shadow-md"
        />
      </div>
    )}
    <button
      onClick={handleProvideFreeProduct}
      className="w-full mt-4 bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-200"
    >
      Fornisci Gratis
    </button>
  </div>
)}


      {/* Modal Alert */}
      {showAlert && (
        <AlertModal
          message={alertMessage}
          type={alertType}
          onClose={closeAlert}
        />
      )}
              <audio ref={successSoundRef} src="/success.mp3" />

    </div>
    
  );
};

export default QrCodeScanner;
