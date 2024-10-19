// RewardList.js
'use client';

import React, { useState, useEffect } from 'react';

const RewardList = ({ qrCodes, handleProductClick, showQrCodeIndex, setShowQrCodeIndex, points, products }) => {
  return (
    <div className="mb-20">
      <h3 className="text-xl font-bold mb-4">{qrCodes.length > 0 ? "Prodotti Acquistati" : "Prodotti Disponibili"}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(qrCodes.length > 0 ? qrCodes : products).map((item, index) => {
          const product = qrCodes.length > 0
            ? products.find(p => p.id === item.product_id)
            : item;

          return (
            <div
              key={index}
              className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ${points >= product.points ? "hover:shadow-xl" : "opacity-50"}`}
              onClick={() => qrCodes.length === 0 && handleProductClick(product)}
              onMouseEnter={() => setShowQrCodeIndex(index)} // Mostra QR code
              onMouseLeave={() => setShowQrCodeIndex(null)} // Nasconde QR code
            >
              {showQrCodeIndex === index && qrCodes.length > 0 ? (
                <img
                  src={item.qr_code}
                  alt={`QR Code ${index}`}
                  className="w-full h-64 object-cover cursor-pointer"
                />
              ) : (
                <>
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-48 object-cover cursor-pointer"
                  />
                  <div className="p-4">
                    <h4 className="font-bold mb-2">{product.name}</h4>
                    <p className="text-sm text-fuchsia-600">{product.points} points</p>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RewardList;
