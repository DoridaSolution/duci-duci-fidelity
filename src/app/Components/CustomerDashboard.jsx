'use client';

import React, { useState, useEffect } from 'react';
import LogoutButton from './Logout';
import AlertModal from './AlertModal';
import Navigation from './Dashboard/Navigation';
import Shop from "../Components/Dashboard/Shop";
import RewardsComponent from './Dashboard/RewardsComponent'; // Importiamo il nuovo componente
import ReferralManagement from "../Components/ReferallManagment";
import PointsProgress from './PointsProgress';
import Test from './ModalPhoto';
import ModalPhoto from './ModalPhoto';

const CustomerDashboard = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [points, setPoints] = useState(0);
  const [qrCode, setQrCode] = useState('');
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState("");
  const [userId, setUserId] = useState(null);
  const [alert, setAlert] = useState(null);
  const [purchases, setPurchases] = useState([]); // Aggiungi questo stato
  const [level, setLevel] = useState('Bronze'); // Aggiungi stato per il livello
const [realpoint, setRealpoint] = useState(0);
const [photoUrl, setPhotoUrl] = useState('');
const [isModalOpen, setIsModalOpen] = useState(false); // Stato per il modale

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  useEffect(() => {
    fetchData();
  }, [userId]);

useEffect(()=>{
  fetchUserMembership();
  const storedPhotoUrl = localStorage.getItem('photoUrl');
    if (storedPhotoUrl) {
      setPhotoUrl(storedPhotoUrl);
    }
},[])

const handlePhotoUpdate = (newPhotoUrl) => {
  setPhotoUrl(newPhotoUrl);
  localStorage.setItem('photoUrl', newPhotoUrl);
  setIsModalOpen(false); // Chiudi il modale dopo l'aggiornamento
};


  const fetchUserMembership = async () => {
    try {
      // Chiamata all'API
      const response = await fetch('/api/users/updateUserLevel', {
        method: 'POST',
        credentials: 'include', // Include il cookie per l'autenticazione
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      // Verifica se la risposta è ok (status 2xx)
      if (response.ok) {
        const data = await response.json();
        setLevel(data.level); // Aggiorna il livello dell'utente
 setRealpoint(data.totalPoints);
 console.log(data.realpoint) // Aggiorna ilealpoint); // Aggiorna ilealpoint); // Aggiorna ilotalPoints)
        console.log('Livello aggiornato:', data);
        // Esegui qualsiasi altra logica necessaria con i dati restituiti
      } else {
        // Gestione degli errori basata sul codice di risposta
        console.error('Errore durante l\'aggiornamento del livello:', response.status);
      }
    } catch (error) {
      // Gestione degli errori di rete o altre eccezioni
      console.error('Errore di rete:', error);
    }
  };
  


  const fetchData = async () => {
    try {
      const resProfile = await fetch('/api/users/profile', {
        method: 'GET',
        credentials: 'include',
      });

      if (resProfile.ok) {
        const dataProfile = await resProfile.json();
        setPoints(dataProfile.points);
        setQrCode(dataProfile.qr_code);
        setUser(dataProfile.name);
        setUserId(dataProfile.id);
      } else {
        const errorData = await resProfile.json();
        setAlert({ message: errorData.message || 'Errore nel caricamento del profilo. Effettua il login.', type: 'errore' });
        setTimeout(() => {
          window.location.href = '/Login';
        }, 3000);
      }

      const resProducts = await fetch('/api/product', {
        method: 'GET',
        credentials: 'include',
      });
      const dataProducts = await resProducts.json();
      if (resProducts.ok) {
        setProducts(dataProducts);
      } else {
        setAlert({ message: dataProducts.message || 'Errore nel caricamento dei prodotti.', type: 'errore' });
      }
    } catch (error) {
      console.error('Errore durante il fetch dei dati:', error);
      setAlert({ message: 'Errore nel caricamento dei dati.', type: 'errore' });
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div>
            {/* QR Code Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 flex flex-col items-center ">
              {qrCode && (
                <img
                  src={qrCode}
                  alt="QR Code"
                  width={128}
                  height={128}
                  className="w-32 h-32 object-cover rounded-3 shadow-md qr"
                />
              )}
              <p className="text-center mt-2 font-medium">Scannerizza al checkout</p>
            </div>
            {/* Profile Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 flex justify-between items-center">
              <div className="flex items-center">
                {/* Cerchio con la foto */}
                <div
                  className="relative w-16 h-16 mr-4 rounded-full border-4 border-fuchsia-600 flex items-center justify-center cursor-pointer"
                  onClick={() => photoUrl=="null" && setIsModalOpen(true)} // Apri il modale se non c'è una foto
                >
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt="User Profile"
                      className="w-full h-full object-cover rounded-full"
                      style={{ objectPosition: 'top center' }}
                    />
                  ) : (
                    <div className="flex flex-col items-center text-fuchsia-600">
                      <i className="fas fa-camera text-2xl"></i>
                      <p className="text-sm">Aggiungi Foto</p>
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-start">{user}</h2>
                  <p className="text-fuchsia-600 font-medium text-start">Punti Accumulati: {points}</p>
                  <p className="text-fuchsia-900 font-medium text-start">Livello Goloso (1)</p>
                </div>
              </div>
              <LogoutButton />
            </div>

            <div className="bg-white rounded-2xl items-center">
              <PointsProgress points={realpoint} level={level} /> {/* Passa il livello al componente */}
            </div>

            {/* Sezione prodotti disponibili */}
          
            <Shop
              products={products}
              points={points}
              userId={userId}
              setPoints={setPoints}
              setAlert={setAlert}
              setPurchases={setPurchases} 
            />
          </div>
        );

      case 'profile':
        return <div className="text-center text-gray-500"></div>;

      case 'rewards':
        return (
          <RewardsComponent
            products={products}
            setAlert={setAlert}
          />
        );

      case 'referral':
        return <ReferralManagement />;

      default:
        return <div className="text-center text-gray-500">Seleziona una sezione.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-pink-200 text-fuchsia-900 font-sans">
      <div className="max-w-md mx-auto p-4">
        {renderContent()}

        {/* Alert Modal */}
        {alert && (
          <AlertModal
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert(null)}
          />
        )}

        {/* Modal Photo */}
        {isModalOpen && (
          <ModalPhoto
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onPhotoUpdate={handlePhotoUpdate}
          />
        )}
      </div>

      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
    </div>
  );
};

export default CustomerDashboard;
