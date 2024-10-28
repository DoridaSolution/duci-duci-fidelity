// /src/Components/Dashboard/KPISection.jsx
import React from 'react';

const KPISection = ({ newUsers, totalPoints, totalTransactions, topUsers, topProducts }) => {
  return (
    <div className="bg-white p-4 rounded shadow-lg text-bg-warning">
      <h2 className="text-2xl font-bold mb-6">Panoramica KPI</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-fuchsia-100 p-4 rounded">
          <h3 className="text-xl font-semibold">Nuovi Utenti (Ultimo Mese)</h3>
          <p className="text-3xl font-bold">{newUsers}</p>
        </div>
        <div className="bg-fuchsia-100 p-4 rounded">
          <h3 className="text-xl font-semibold">Punti Totali Guadagnati</h3>
          <p className="text-3xl font-bold">{totalPoints}</p>
        </div>
        <div className="bg-fuchsia-100 p-4 rounded">
          <h3 className="text-xl font-semibold">Transazioni Totali</h3>
          <p className="text-3xl font-bold">{totalTransactions}</p>
        </div>
        <div className="bg-fuchsia-100 p-4 rounded">
          <h3 className="text-xl font-semibold">Top Utenti</h3>
          <ul>
            {topUsers.map((user) => (
              <li key={user.name} className="text-lg">
                {user.name}: {user.total_points} punti
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-fuchsia-100 p-4 rounded col-span-2">
          <h3 className="text-xl font-semibold">Prodotti più Acquistati</h3>
          <ul>
            {topProducts.map((product) => (
              <li key={product.name} className="text-lg">
                {product.name}: {product.purchase_count} acquisti
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default KPISection;
