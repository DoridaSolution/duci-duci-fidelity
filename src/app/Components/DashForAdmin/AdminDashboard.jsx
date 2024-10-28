'use client';

import React, { useState, useEffect } from 'react';
import UserTable from '../../Components/DashForAdmin/UserTable';
import TransactionStats from '../../Components/DashForAdmin/TransactionStats';
import ProductStats from '../../Components/DashForAdmin/ProductStats';
import RewardStats from '../../Components/DashForAdmin/RewardStats';
import ReferralStats from '../../Components/DashForAdmin/ReferralStats';
import KPISection from './KPISection';
import useAuth from '@/app/hook/useAuth';

const AdminDashboard = () => {
  const { isAuthenticated, userRole, loading } = useAuth('admin');  // Solo gli admin possono accedere
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Gestione sidebar

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center">Caricamento...</div>;
  }

  if (!isAuthenticated || userRole !== 'admin') {
    return <div className="vh-100 bg-black text-white flex justify-center items-center">Accesso negato</div>;
  }
  
  const [activeSection, setActiveSection] = useState('users');
  const [filter, setFilter] = useState('month'); // Default: Ultimo Mese
  const [kpis, setKpis] = useState({
    newUsers: 0,
    totalPoints: 0,
    totalTransactions: 0,
    topUsers: [],
    topProducts: []
  });

  useEffect(() => {
    fetchKpis();
  }, [filter]);

  const fetchKpis = async () => {
    try {
      const response = await fetch(`/api/admin/kpis?filter=${filter}`, { credentials: 'include' });
      const data = await response.json();
      if (response.ok) {
        setKpis(data); // Salva i dati dei KPI nello stato
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Errore durante il fetch dei KPI:', error);
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'users':
        return <UserTable />;
      case 'transactions':
        return <TransactionStats />;
      case 'products':
        return <ProductStats />;
      case 'rewards':
        return <RewardStats />;
      case 'referrals':
        return <ReferralStats />;
      case 'analytics':
        return (
          <KPISection
            newUsers={kpis.newUsers}
            totalPoints={kpis.totalPoints}
            totalTransactions={kpis.totalTransactions}
            topUsers={kpis.topUsers}
            topProducts={kpis.topProducts}
          />
        );
      default:
        return <UserTable />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center text-fuchsia-900 mb-6">Admin Dashboard</h1>
      <div className="flex justify-center mb-6">
        <button
          className={`px-4 py-2 mx-2 rounded ${
            activeSection === 'users' ? 'bg-fuchsia-500 text-white' : 'bg-white text-fuchsia-500 border border-fuchsia-500'
          }`}
          onClick={() => setActiveSection('users')}
        >
          Utenti
        </button>
        <button
          className={`px-4 py-2 mx-2 rounded ${
            activeSection === 'transactions' ? 'bg-fuchsia-500 text-white' : 'bg-white text-fuchsia-500 border border-fuchsia-500'
          }`}
          onClick={() => setActiveSection('transactions')}
        >
          Transazioni
        </button>
        <button
          className={`px-4 py-2 mx-2 rounded ${
            activeSection === 'products' ? 'bg-fuchsia-500 text-white' : 'bg-white text-fuchsia-500 border border-fuchsia-500'
          }`}
          onClick={() => setActiveSection('products')}
        >
          Prodotti
        </button>
        <button
          className={`px-4 py-2 mx-2 rounded ${
            activeSection === 'rewards' ? 'bg-fuchsia-500 text-white' : 'bg-white text-fuchsia-500 border border-fuchsia-500'
          }`}
          onClick={() => setActiveSection('rewards')}
        >
          Premi
        </button>
        <button
          className={`px-4 py-2 mx-2 rounded ${
            activeSection === 'referrals' ? 'bg-fuchsia-500 text-white' : 'bg-white text-fuchsia-500 border border-fuchsia-500'
          }`}
          onClick={() => setActiveSection('referrals')}
        >
          Referral
        </button>
        <button
          className={`px-4 py-2 mx-2 rounded text-white ${
            activeSection === 'analytics' ? 'bg-fuchsia-500 text-white' : 'bg-white text-fuchsia-500 border border-fuchsia-500'
          }`}
          onClick={() => setActiveSection('analytics')}
        >
          Analytics
        </button>
      </div>
      {renderSection()}
    </div>
  );
};

export default AdminDashboard;
