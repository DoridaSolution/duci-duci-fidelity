'use client';

import React, { useState } from 'react';
import QRCode from 'qrcode';

const Shop = ({ products, points, userId, setPoints, setAlert, setPurchases }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleProductClick = (product) => {
    if (points >= product.points) {
      setSelectedProduct(product);
      setIsModalOpen(true);
    } else {
      setAlert({ message: 'Non hai abbastanza punti per acquistare questo prodotto.', type: 'errore' });
    }
  };

  const handleConfirmPurchase = async () => {
    setIsLoading(true);
    try {
      // 1. Crea una nuova voce di acquisto per ottenere un purchaseId univoco
      const resCreatePurchase = await fetch(`/api/users/createPurchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ productId: selectedProduct.id }),
      });

      if (!resCreatePurchase.ok) throw new Error("Errore durante la creazione dell'acquisto");

      const { purchaseId } = await resCreatePurchase.json();

      // 2. Generazione del QR Code con il purchaseId ottenuto
      const qrData = { userId, productId: selectedProduct.id, purchaseId };
      const qrCodeGenerated = await QRCode.toDataURL(JSON.stringify(qrData));

      // 3. Salva il QR Code nel backend
      const resSaveQr = await fetch(`/api/users/saveQr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ qrCode: qrCodeGenerated, productId: selectedProduct.id, purchaseId }),
      });

      if (!resSaveQr.ok) throw new Error("Errore durante il salvataggio del QR code");

      // 4. Aggiorna i punti dell'utente
      const resPoints = await fetch(`/api/users/updatePoints`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ pointsToDeduct: selectedProduct.points }),
      });

      if (!resPoints.ok) throw new Error("Errore durante la sottrazione dei punti");

      // Tutto è andato a buon fine, aggiorna lo stato
      setPoints((prevPoints) => prevPoints - selectedProduct.points);
      setPurchases((prevPurchases) => [
        ...prevPurchases,
        {
          user_id: userId,
          product_id: selectedProduct.id,
          purchase_id: purchaseId,
          created_at: new Date(),
          qr_code: qrCodeGenerated,
        },
      ]);
      setAlert({ message: `Hai acquistato ${selectedProduct.name}!`, type: 'success' });
    } catch (error) {
      // Gestisci tutti gli errori in un'unica sezione
      console.error('Errore durante il processo di acquisto:', error);
      setAlert({ message: error.message, type: 'error' });
    } finally {
      setIsModalOpen(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-20">
      <h3 className="text-lg font-bold mb-4 text-center">Prodotti Disponibili</h3>
      <div className="space-y-4">
        {products.map((product, index) => (
          <div
            key={index}
            className={`bg-white rounded-2xl shadow-md overflow-hidden transition-transform transform hover:scale-105 ${
              points >= product.points ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'
            }`}
            onClick={() => handleProductClick(product)}
          >
            <img
              src={product.image_url}
              alt={product.name}
              width={384}
              height={192}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h4 className="font-bold text-lg">{product.name}</h4>
              <p className="text-sm text-fuchsia-600">{product.points} punti</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Purchase Confirmation */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-sm">
            <h3 className="text-lg font-bold mb-4 text-center">Conferma Acquisto</h3>
            <p className="text-center">
              Sei sicuro di voler acquistare <strong>{selectedProduct.name}</strong> per <strong>{selectedProduct.points}</strong> punti?
            </p>
            <div className="mt-4 flex justify-around">
              <button
                onClick={handleConfirmPurchase}
                className="bg-fuchsia-500 text-white px-4 py-2 rounded-md flex items-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    ></path>
                  </svg>
                ) : null}
                {isLoading ? 'Conferma...' : 'Conferma'}
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                disabled={isLoading}
              >
                Annulla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
