import React, { useState, useEffect } from 'react';

const RewardStats = () => {
  const [rewards, setRewards] = useState([]);

  useEffect(() => {
    // Fetch dei premi dall'API
    const fetchRewards = async () => {
      try {
        const response = await fetch('/api/admin/rewards', { method: 'GET', credentials: 'include' });
        const data = await response.json();
        if (response.ok) {
          setRewards(data);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error('Errore durante il fetch dei premi:', error);
      }
    };

    fetchRewards();
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow-lg">
      <h2 className="text-xl font-bold mb-4">Gestione Premi</h2>
      <table className="w-full text-left table-auto">
        <thead>
          <tr className="bg-fuchsia-500 text-white">
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Nome</th>
            <th className="px-4 py-2">Punti Necessari</th>
            <th className="px-4 py-2">Descrizione</th>
          </tr>
        </thead>
        <tbody>
          {rewards.map((reward) => (
            <tr key={reward.id} className="border-t">
              <td className="px-4 py-2">{reward.id}</td>
              <td className="px-4 py-2">{reward.name}</td>
              <td className="px-4 py-2">{reward.points_required}</td>
              <td className="px-4 py-2">{reward.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RewardStats;
