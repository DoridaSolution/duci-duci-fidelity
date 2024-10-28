import React, { useState, useEffect } from 'react';

const UserTable = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch the list of users from the API
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/admin/users', { method: 'GET', credentials: 'include' });
        const data = await response.json();
        if (response.ok) {
          setUsers(data);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error('Errore durante il fetch degli utenti:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow-lg">
      <h2 className="text-xl font-bold mb-4">Gestione Utenti</h2>
      <table className="w-full text-left table-auto">
        <thead>
          <tr className="bg-fuchsia-500 text-white">
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Nome</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Livello</th>
            <th className="px-4 py-2">Punti Totali</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t">
              <td className="px-4 py-2">{user.id}</td>
              <td className="px-4 py-2">{user.name}</td>
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2">{user.level}</td>
              <td className="px-4 py-2">{user.total_points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
