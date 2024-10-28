import React, { useState, useEffect } from 'react';

const TransactionStats = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Fetch delle transazioni dall'API
    const fetchTransactions = async () => {
      try {
        const response = await fetch('/api/admin/transactions', { method: 'GET', credentials: 'include' });
        const data = await response.json();
        if (response.ok) {
          setTransactions(data);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error('Errore durante il fetch delle transazioni:', error);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow-lg">
      <h2 className="text-xl font-bold mb-4">Transazioni Recenti</h2>
      <table className="w-full text-left table-auto">
        <thead>
          <tr className="bg-fuchsia-500 text-white">
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">ID Utente</th>
            <th className="px-4 py-2">Punti</th>
            <th className="px-4 py-2">Tipo Transazione</th>
            <th className="px-4 py-2">Data</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="border-t">
              <td className="px-4 py-2">{transaction.id}</td>
              <td className="px-4 py-2">{transaction.user_id}</td>
              <td className="px-4 py-2">{transaction.points}</td>
              <td className="px-4 py-2">{transaction.transaction_type}</td>
              <td className="px-4 py-2">{new Date(transaction.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionStats;
