import React, { useState, useEffect } from 'react';
import LogoutButton from '../../Components/Logout';

const HomeComponent = () => {
  const [user, setUser] = useState({});
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/users/profile', {
          method: 'GET',
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          setPoints(data.points);
        } else {
          console.error('Errore nel caricamento del profilo');
        }
      } catch (error) {
        console.error('Errore nel caricamento del profilo:', error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 flex justify-between items-center">
      <div>
        <h2 className="text-xl font-bold">{user.name}</h2>
        <p className="text-fuchsia-600 font-medium">Punti Accumulati: {points}</p>
        <p className="text-fuchsia-900 font-medium">Livello Goloso (1)</p>
      </div>
      <LogoutButton />
    </div>
  );
};

export default HomeComponent;
