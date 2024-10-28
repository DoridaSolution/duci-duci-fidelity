'use client';

import React, { useState, useEffect } from 'react';

const PurchasedProduct = ({ userId, products, setAlert }) => {
  const [purchases, setPurchases] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('purchases'); // Stato per controllare il tab attivo

  useEffect(() => {
    if (userId) {
      fetchPurchases();
    }
  }, [userId]);

  const fetchPurchases = async () => {
    try {
      setIsLoading(true);
      const resPurchases = await fetch('/api/users/history/qr', {
        method: 'GET',
        credentials: 'include',
      });
      if (resPurchases.ok) {
        const dataPurchases = await resPurchases.json();
        setPurchases(dataPurchases.qrCodes);
        setTransactions(dataPurchases.transactions);
      } else {
        const errorPurchases = await resPurchases.json();
        setAlert({ message: errorPurchases.message || 'Errore nel caricamento degli acquisti.', type: 'errore' });
      }
    } catch (error) {
      console.error('Errore durante il fetch degli acquisti:', error);
      setAlert({ message: 'Errore nel caricamento dei dati degli acquisti.', type: 'errore' });
    } finally {
      setIsLoading(false);
    }
  };

  const getGroupedPurchases = () => {
    const grouped = {};
    purchases.forEach((purchase) => {
      const { product_id, qr_code } = purchase;
      if (!grouped[product_id]) {
        grouped[product_id] = {
          product: products.find((p) => p.id === product_id),
          count: 1,
          qrCodes: [purchase],
        };
      } else {
        grouped[product_id].count += 1;
        grouped[product_id].qrCodes.push(purchase);
      }
    });
    return Object.values(grouped);
  };

  const groupedPurchases = getGroupedPurchases();

  return (
    <div className="flex flex-col h-full">
      {/* Header per il titolo e navigazione */}
      <div className="flex justify-around bg-white shadow-md p-2 sticky top-0 z-10">
        <button
          className={`flex-1 text-center py-2 ${activeTab === 'purchases' ? 'text-fuchsia-600 border-b-2 border-fuchsia-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('purchases')}
        >
          Prodotti Acquistati
        </button>
        <button
          className={`flex-1 text-center py-2 ${activeTab === 'transactions' ? 'text-fuchsia-600 border-b-2 border-fuchsia-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('transactions')}
        >
          Cronologia Transazioni
        </button>
      </div>

      {/* Contenuto principale */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
        {isLoading ? (
          <div className="text-center">Caricamento in corso...</div>
        ) : activeTab === 'purchases' ? (
          <div>
            <h3 className="text-lg font-bold mb-4 text-center">Prodotti Acquistati</h3>
            {groupedPurchases.length > 0 ? (
              groupedPurchases.map((group, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-md p-4 mb-4">
                  <h4 className="font-bold text-lg">{group.product.name}</h4>
                  <p className="text-sm text-fuchsia-600">Quantità Acquistata: {group.count}</p>
                  <div className="flex flex-wrap mt-4">
                    {group.qrCodes.map((qrCode, index) => (
                      <img
                        key={index}
                        src={qrCode.qr_code}
                        alt={`QR Code ${index + 1}`}
                        className="w-24 h-24 object-cover m-2 border-2 border-fuchsia-500 rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">Nessun prodotto acquistato.</p>
            )}
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-bold mb-4 text-center">Cronologia Transazioni</h3>
            {transactions.length > 0 ? (
              transactions.map((transaction, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-md p-4 mb-4">
                  <h4 className="font-bold text-lg">{`Transazione ID: ${transaction.id}`}</h4>
                  <p className="text-sm text-gray-700">
                    <strong>Prodotto:</strong> {products.find((p) => p.id === transaction.product_id)?.name || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Punti Spesi:</strong> {transaction.points}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Importo:</strong> €{transaction.amount}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Data:</strong> {new Date(transaction.created_at).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">Nessuna transazione registrata.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchasedProduct;
