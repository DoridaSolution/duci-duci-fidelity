'use client';

import React from 'react';
import { FaHome, FaUserFriends, FaGift, FaUserPlus, FaShoppingCart } from "react-icons/fa";

const Navigation = ({ activeTab, setActiveTab, setShowQrProducts }) => {
  const tabs = [
    { icon: FaHome, label: "Home" },
    { icon: FaUserFriends, label: "Profile" },
    { icon: FaGift, label: "Rewards" },
    { icon: FaShoppingCart, label: "Shop" }, // Nuova tab "Shop"
    { icon: FaUserPlus, label: "Referral" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg rounded-t-2xl">
      <ul className="flex justify-around p-4">
        {tabs.map((item) => (
          <li key={item.label}>
            <button
              onClick={() => {
                setActiveTab(item.label.toLowerCase());
                setShowQrProducts(item.label === "Rewards");
              }}
              className={`p-2 rounded-full transition-colors duration-300 ${
                activeTab === item.label.toLowerCase()
                  ? "bg-fuchsia-500 text-white"
                  : "text-fuchsia-500 hover:bg-fuchsia-100"
              }`}
              aria-label={item.label}
            >
              <item.icon className="w-6 h-6" /> {/* Uso dell'icona come componente JSX */}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
