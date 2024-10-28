import React, { useState, useEffect } from 'react';

const ReferralStats = () => {
  const [referrals, setReferrals] = useState([]);

  useEffect(() => {
    // Fetch dei referral dall'API
    const fetchReferrals = async () => {
      try {
        const response = await fetch('/api/admin/referrals', { method: 'GET', credentials: 'include' });
        const data = await response.json();
        if (response.ok) {
          setReferrals(data);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error('Errore durante il fetch dei referral:', error);
      }
    };

    fetchReferrals();
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow-lg">
      <h2 className="text-xl font-bold mb-4">Gestione Referral</h2>
      <table className="w-full text-left table-auto">
        <thead>
          <tr className="bg-fuchsia-500 text-white">
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">ID Utente</th>
            <th className="px-4 py-2">ID Referente</th>
            <th className="px-4 py-2">Stato</th>
            <th className="px-4 py-2">Punti Assegnati</th>
          </tr>
        </thead>
        <tbody>
          {referrals.map((referral) => (
            <tr key={referral.id} className="border-t">
              <td className="px-4 py-2">{referral.id}</td>
              <td className="px-4 py-2">{referral.referred_user_id}</td>
              <td className="px-4 py-2">{referral.referrer_id}</td>
              <td className="px-4 py-2">{referral.status}</td>
              <td className="px-4 py-2">{referral.points_awarded}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReferralStats;
