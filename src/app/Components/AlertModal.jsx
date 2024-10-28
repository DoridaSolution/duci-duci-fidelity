// components/AlertModal.jsx
'use client';

import React from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle } from "react-icons/fa";

const AlertModal = ({ message, type, onClose }) => {
  // Icona basata sul tipo di alert
  const renderIcon = () => {
    switch(type) {
      case 'successo':
        return <FaCheckCircle className="text-green-500 w-6 h-6 mr-2" />;
      case 'errore':
        return <FaExclamationCircle className="text-red-500 w-6 h-6 mr-2" />;
      case 'info':
      default:
        return <FaInfoCircle className="text-blue-500 w-6 h-6 mr-2" />;
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-2">
        <div className="flex items-center mb-4">
          {renderIcon()}
          <h3 className="text-xl font-bold capitalize">{type}</h3>
        </div>
        <p className="mb-4">{message}</p>
        <div className="flex justify-end">
          <button 
            onClick={onClose} 
            className="bg-fuchsia-500 text-white px-4 py-2 rounded-md"
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
