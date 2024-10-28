// UserProfile.js
'use client';

import React, { useState, useEffect } from 'react';
import LogoutButton from '../../Components/Logout';
import AlertModal from '../../Components/AlertModal';
import PointsProgress from '../../Components/PointsProgress';
const UserProfile = ({ userId, setAlert, setPoints, setQrCode, setUser, setLevel, setRealpoint, qrCode, points, level, user }) => {
    useEffect(() => {
      fetchUserProfile();
    }, [userId]);
  
    const fetchUserProfile = async () => {
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
        } else {
          const errorData = await resProfile.json();
          setAlert({ message: errorData.message || 'Errore nel caricamento del profilo. Effettua il login.', type: 'errore' });
          setTimeout(() => {
            window.location.href = '/Login';
          }, 3000);
        }
      } catch (error) {
        console.error('Errore durante il fetch dei dati:', error);
        setAlert({ message: 'Errore nel caricamento dei dati.', type: 'errore' });
      }
    };
  
    return (
      <div>
        {/* QR Code Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 flex flex-col items-center">
          {qrCode && (
            <img
              src={qrCode}
              alt="QR Code"
              width={128}
              height={128}
              className="w-32 h-32 object-cover rounded-3 shadow-md"
            />
          )}
          <p className="text-center mt-2 font-medium">Scannerizza al checkout</p>
        </div>
        {/* Profile Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-start">{user}</h2>
            <p className="text-fuchsia-600 font-medium text-start">Punti Accumulati: {points}</p>
            <p className="text-fuchsia-900 font-medium text-start">Livello: {level}</p>
          </div>
          <LogoutButton />
        </div>
        <PointsProgress points={realpoint} level={level} />
      </div>
    );
  };
  
  export default UserProfile;