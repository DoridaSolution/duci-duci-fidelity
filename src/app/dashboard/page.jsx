'use client';

import React, { useState } from 'react';
import AddPointsForm from '../components/AddPointsForm';
import ProductScanner from '../components/ProductScanner';


import useAuth from '../hook/useAuth';

const Dashboard = () => {
  const { isAuthenticated, userRole, loading } = useAuth('admin');  // Solo gli admin possono accedere
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Gestione sidebar

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center">Caricamento...</div>;
  }

  if (!isAuthenticated || userRole !== 'admin') {
    return <div className="vh-100 bg-black text-white flex justify-center items-center">Accesso negato</div>;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-gray-100 to-pink-100">
      {/* Sidebar */}
   
      <div className="flex-1 flex flex-col">
        {/* Navbar */}


        {/* Contenuto principale */}
        <main className="p-4 sm:p-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AddPointsForm />
            <ProductScanner />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
