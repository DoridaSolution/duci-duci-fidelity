// RewardsComponent.jsx

import React, { useState, useEffect } from 'react';
import PurchasedProduct from '../../Components/PurchasedProduct';

const RewardsComponent = ({ products, setAlert }) => {
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await fetch('/api/users/history/qr', {
          method: 'GET',
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          setPurchases(data.qrCodes);
        } else {
          setAlert({ message: 'Errore nel caricamento degli acquisti.', type: 'error' });
        }
      } catch (error) {
        console.error('Errore nel caricamento degli acquisti:', error);
        setAlert({ message: 'Errore nel caricamento degli acquisti.', type: 'error' });
      }
    };

    fetchPurchases();
  }, []);

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
    <div className="space-y-4">
      {groupedPurchases.length > 0 ? (
        groupedPurchases.map((group, index) => (
          <PurchasedProduct
            key={index}
            product={group.product}
            purchaseCount={group.count}
            qrCodes={group.qrCodes}
          />
        ))
      ) : (
        <p className="text-center text-gray-500">Nessun prodotto acquistato.</p>
      )}
    </div>
  );
};

export default RewardsComponent;
