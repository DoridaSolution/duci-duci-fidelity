import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { FaSearchPlus, FaTrashAlt } from 'react-icons/fa'; // Importa l'icona per eliminare

const PurchasedProduct = ({ product, purchaseCount, qrCodes, setAlert, setPurchases }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQrCode, setSelectedQrCode] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const sliderSettings = {
    dots: false,
    infinite: qrCodes.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: qrCodes.length > 1,
    adaptiveHeight: true,
  };

  // Funzione per aprire il modal
  const openModal = (qrCode) => {
    setSelectedQrCode(qrCode);
    setIsModalOpen(true);
    document.body.classList.add('modal-open');
  };

  // Funzione per chiudere il modal
  const closeModal = () => {
    setSelectedQrCode(null);
    setIsModalOpen(false);
    document.body.classList.remove('modal-open');
  };

  // Funzione per gestire la conferma dell'eliminazione
  const confirmDelete = (qrCode) => {
    setSelectedQrCode(qrCode);
    setShowConfirmation(true);
  };

  // Funzione per annullare l'eliminazione
  const cancelDelete = () => {
    setSelectedQrCode(null);
    setShowConfirmation(false);
  };

  // Funzione per eliminare un acquisto
  const handleDelete = async () => {
    if (!selectedQrCode) return;

    try {
      const response = await fetch('/api/users/Products/delete-purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ purchaseId: selectedQrCode.purchase_id, userId: selectedQrCode.user_id }),
      });

      const data = await response.json();

      if (response.ok) {
        // Rimuovi l'acquisto dal frontend
        setPurchases((prevPurchases) =>
          prevPurchases.filter((purchase) => purchase.id !== selectedQrCode.purchase_id)
        );

        // Aggiorna l'utente con un messaggio di successo
        setAlert({ message: data.message, type: 'successo' });
        setShowConfirmation(false);
      } else {
        setAlert({ message: data.message, type: 'errore' });
      }
    } catch (error) {
      console.error('Errore durante l\'eliminazione dell\'acquisto:', error);
      setAlert({ message: 'Errore durante l\'eliminazione dell\'acquisto.', type: 'errore' });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };
    if (isModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    } else {
      window.removeEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen]);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform transform hover:scale-105 mx-auto p-2 w-full">
      <div className="flex flex-col md:flex-row justify-between">
        <div className="flex-1 p-2">
          <div className="relative">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-24 object-cover rounded-lg"
            />
            {purchaseCount > 1 && (
              <span className="absolute top-2 right-2 bg-fuchsia-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                x{purchaseCount}
              </span>
            )}
          </div>
          <div className="mt-2">
            <h4 className="font-bold text-md mb-1">{product.name}</h4>
            <p className="text-sm text-fuchsia-600 mb-2">{product.points} punti</p>
          </div>
        </div>
        <div className="flex-1 p-2">
          {qrCodes.length > 0 && (
            <div className="flex justify-center">
              <div className="w-full max-w-[100px]">
                <Slider {...sliderSettings}>
                  {qrCodes.map((qr, index) => (
                    <div key={index} className="flex justify-center">
                      <div className="relative cursor-pointer" onClick={() => openModal(qr.qr_code)}>
                        <img
                          src={qr.qr_code}
                          alt={`QR Code ${index + 1}`}
                          className="w-24 h-24 object-contain rounded-lg shadow-md"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-25 opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-lg">
                          <FaSearchPlus className="text-white h-6 w-6" />
                        </div>
                      </div>
                      <button
                        onClick={() => confirmDelete(qr)}
                        className="text-red-500 mt-2 flex items-center justify-center"
                        title="Elimina questo acquisto"
                      >
                        <FaTrashAlt className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal di conferma eliminazione */}
      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
            <h2 className="text-lg font-semibold mb-4">Conferma Eliminazione</h2>
            <p className="mb-4">Sei sicuro di voler eliminare questo acquisto? I punti saranno ripristinati.</p>
            <div className="flex justify-between">
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md"
              >
                Elimina
              </button>
              <button
                onClick={cancelDelete}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md"
              >
                Annulla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal per Mostrare il QR Code Enlarged */}
      {isModalOpen && selectedQrCode && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg p-3 relative max-w-xs sm:max-w-sm w-full mx-4 transform scale-95 animate-scale-up modal-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-700 hover:text-gray-900 text-xl font-bold"
              aria-label="Chiudi"
            >
              ✕
            </button>
            <img
              src={selectedQrCode}
              alt="QR Code Enlarged"
              className="w-full h-full object-contain rounded-lg shadow-md"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchasedProduct;
