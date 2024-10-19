'use client';

import React, { useState, useEffect } from 'react';
import { FaHome, FaUser, FaGift } from "react-icons/fa";
import QRCode from 'qrcode';
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import LogoutButton from './Logout';

const CustomerDashboard = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [points, setPoints] = useState(0);
  const [qrCode, setQrCode] = useState('');
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [user, setUser] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [qrCodes, setQrCodes] = useState([]); // Stato per i QR code generati
  const [showQrProducts, setShowQrProducts] = useState(false); // Stato per visualizzare solo prodotti con QR code
  const [showQrCodeIndex, setShowQrCodeIndex] = useState(null); // Stato per tracciare l'indice del QR code da mostrare

  useEffect(() => {
    fetchData(); // Recupera i dati al caricamento del componente
  }, [userId]);

  const fetchData = async () => {
    try {
      // Recupera profilo utente
      const resProfile = await fetch('/api/users/profile', {
        method: 'GET',
        credentials: 'include',  // Include i cookie nella richiesta
      });
      if (resProfile.ok) {
        const dataProfile = await resProfile.json();
        setPoints(dataProfile.points);
        setQrCode(dataProfile.qr_code);
        setUser(dataProfile.name);
      } else {
        const errorData = await resProfile.json();
        setMessage(errorData.message || 'Errore nel caricamento del profilo. Effettua il login.');
        window.location.href = '/Login';  // Reindirizza alla pagina di login
      }

      // Recupera prodotti
      const resProducts = await fetch('/api/product', {
        method: 'GET',
        credentials: 'include',
      });
      const dataProducts = await resProducts.json();
      if (resProducts.ok) {
        setProducts(dataProducts);
      } else {
        console.error(dataProducts.message);
      }

      // Recupera QR code e transazioni
      const resQrCodes = await fetch('/api/users/history/qr', {
        method: 'GET',
        credentials: 'include',
      });
      if (resQrCodes.ok) {
        const dataQrCodes = await resQrCodes.json();
        setQrCodes(dataQrCodes.qrCodes);
      } else {
        const errorQr = await resQrCodes.json();
        console.error(errorQr.message || 'Errore nel caricamento dei QR code.');
      }
    } catch (error) {
      console.error('Errore durante il fetch dei dati:', error);
      setMessage('Errore nel caricamento dei dati.');
    }
  };

  const handleProductClick = (product) => {
    if (points >= product.points) {
      setSelectedProduct(product);
      setIsModalOpen(true);
    } else {
      alert('Non hai abbastanza punti per acquistare questo prodotto.');
    }
  };

  const handleConfirmPurchase = async () => {
    try {
      // Invia una richiesta per notificare l'admin dell'acquisto
      const resNotify = await fetch(`/api/users/notifyadmin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ productId: selectedProduct.id }),
      });

      if (resNotify.ok) {
        // Genera un QR code per l'acquisto
        const qrData = { userId, productId: selectedProduct.id };
        const qrCodeGenerated = await QRCode.toDataURL(JSON.stringify(qrData));

        // Salva il QR code nel database
        const resSaveQr = await fetch(`/api/users/saveQr`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ qrCode: qrCodeGenerated, productId: selectedProduct.id }),
        });

        if (resSaveQr.ok) {
          // Aggiorna i punti
          const resPoints = await fetch(`/api/users/updatePoints`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ pointsToDeduct: selectedProduct.points }),
          });

          if (resPoints.ok) {
            const dataPoints = await resPoints.json();
            setPoints(prevPoints => prevPoints - selectedProduct.points); // Aggiorna localmente i punti
            setQrCodes(prevQrCodes => [...prevQrCodes, { product_id: selectedProduct.id, qr_code: qrCodeGenerated }]);
            setQrCode(qrCodeGenerated); // Imposta il QR code generato
            setMessage(`Hai acquistato ${selectedProduct.name}!`);
            setMessageType("success");
          } else {
            const dataPoints = await resPoints.json();
            alert(dataPoints.message || 'Errore durante la sottrazione dei punti.');
          }
        } else {
          const dataSaveQr = await resSaveQr.json();
          alert(dataSaveQr.message || 'Errore durante il salvataggio del QR code.');
        }
      } else {
        const dataNotify = await resNotify.json();
        alert(dataNotify.message || 'Errore nell\'invio della notifica.');
      }

      setIsModalOpen(false); // Chiudi il modale
    } catch (error) {
      console.error('Errore durante il processo di acquisto:', error);
      alert('Errore durante il processo di acquisto. Riprova.');
      setIsModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-pink-200 text-fuchsia-900 font-sans">
      <div className="max-w-4xl mx-auto p-4">
        {/* QR Code Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          {qrCode && <img src={qrCode} alt="QR Code" className="my-4 mx-auto w-48 h-48 object-cover rounded-lg shadow-md" />}
          <p className="text-center mt-2 font-medium">Scannerizza al checkout</p>
        </div>

        {/* Profile Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <LogoutButton />
          <h2 className="text-2xl font-bold">{user}</h2>
          <p className="text-fuchsia-600 font-medium">Punti Accumulati: {points}</p>
        </div>

        {/* Points Progress Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">Points Progress</h3>
          <div className="w-32 h-32 mx-auto">
            <CircularProgressbar
              value={(points / 1000) * 100}
              text={`${points}/1000`}
              styles={buildStyles({
                textSize: "14px",
                pathColor: "#d946ef",
                textColor: "#701a75",
                trailColor: "#fdf2f8"
              })}
            />
          </div>
        </div>

        {/* Products Section */}
        <div className="mb-20">
          <h3 className="text-xl font-bold mb-4">{showQrProducts ? "Prodotti Acquistati" : "Prodotti Disponibili"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(showQrProducts ? qrCodes : products).map((item, index) => {
              const product = showQrProducts 
                ? products.find(p => p.id === item.product_id) 
                : item;

              return (
                <div
                  key={index}
                  className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ${points >= product.points ? "hover:shadow-xl" : "opacity-50"}`}
                  onClick={() => !showQrProducts && handleProductClick(product)}
                  onMouseEnter={() => setShowQrCodeIndex(index)} // Mostra QR code
                  onMouseLeave={() => setShowQrCodeIndex(null)} // Nasconde QR code
                >
                  {showQrCodeIndex === index && showQrProducts ? (
                    <img 
                      src={item.qr_code} 
                      alt={`QR Code ${index}`} 
                      className="w-full h-64 object-cover cursor-pointer" 
                    />
                  ) : (
                    <>
                      <img 
                        src={showQrProducts ? product.image_url : product.image_url} 
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

        {/* Modal for Purchase Confirmation */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4">Conferma Acquisto</h3>
              <p>Sei sicuro di voler acquistare {selectedProduct.name} per {selectedProduct.points} punti?</p>
              <div className="mt-4 flex justify-end">
                <button onClick={handleConfirmPurchase} className="bg-fuchsia-500 text-white px-4 py-2 rounded-md mr-2">Conferma</button>
                <button onClick={() => setIsModalOpen(false)} className="bg-gray-300 px-4 py-2 rounded-md">Annulla</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg rounded-t-2xl">
        <ul className="flex justify-around p-4">
          {[{ icon: FaHome, label: "Home" }, { icon: FaUser, label: "Profile" }, { icon: FaGift, label: "Rewards" }].map((item) => (
            <li key={item.label}>
              <button
                onClick={() => {
                  setActiveTab(item.label.toLowerCase());
                  if (item.label === "Rewards") setShowQrProducts(true);
                  else setShowQrProducts(false);
                }}
                className={`p-2 rounded-full transition-colors duration-300 ${activeTab === item.label.toLowerCase() ? "bg-fuchsia-500 text-white" : "text-fuchsia-500 hover:bg-fuchsia-100"}`}
                aria-label={item.label}
              >
                <item.icon className="w-6 h-6" />
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default CustomerDashboard;
