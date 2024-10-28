'use client';

import { useEffect, useState } from 'react';
import { FaCopy, FaCheck } from 'react-icons/fa';

export default function ReferralDetail() {
  const [referralCode, setReferralCode] = useState('');
  const [invitedUsers, setInvitedUsers] = useState([]);
  const [copied, setCopied] = useState(false);

  // Fetch del referral code e degli utenti invitati dal database al caricamento del componente
  useEffect(() => {
    const fetchReferralDetails = async () => {
      try {
        const res = await fetch('/api/users/referalls/referral-details', {
          method: 'GET',
          credentials: 'include',
        });

        if (res.ok) {
          const data = await res.json();
          setReferralCode(data.referralCode);
          setInvitedUsers(data.invitedUsers || []); // Set invited users if available
        } else {
          console.error('Error fetching referral details:', res.status);
        }
      } catch (error) {
        console.error('Error fetching referral details:', error);
      }
    };

    fetchReferralDetails();
  }, []);

  // Funzione per copiare il codice negli appunti
  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const referralLink = `${window.location.origin}/register?referral=${referralCode}`;

  return (
    <div className=" min-h-screen  sm:p-6 font-sans">
      <div className=" mx-auto">
        <h1 className="text-2xl font-bold text-fuchsia-700 mb-6">Invita i tuoi amici</h1>

        <div className="bg-fuchsia-50 p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
          <h2 className="text-xl font-semibold text-fuchsia-700 mb-4">Il tuo referall code</h2>
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <input
              type="text"
              value={referralCode}
              readOnly
              className="w-full sm:w-3/4 px-4 py-2 border border-fuchsia-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition-all duration-300"
              aria-label="Your unique referral code"
            />
            <button
              onClick={copyToClipboard}
              className={`w-full sm:w-auto px-6 py-2 rounded-md text-white font-semibold transition-all duration-300 ${copied ? 'bg-green-500 hover:bg-green-600' : 'bg-fuchsia-600 hover:bg-fuchsia-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500`}
              aria-label={copied ? "Copied to clipboard" : "Copy referral code"}
            >
              {copied ? (
                <>
                  <FaCheck className="inline-block mr-2" />
                  Copied
                </>
              ) : (
                <>
                  <FaCopy className="inline-block mr-2" />
                  Copy
                </>
              )}
            </button>
          </div>

          <h2 className="text-xl font-semibold text-fuchsia-700 mt-6 mb-2">Referral Link</h2>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="w-full px-4 py-2 border border-fuchsia-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition-all duration-300"
              aria-label="Your referral link"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(referralLink);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className={`px-6 py-2 rounded-md text-white font-semibold transition-all duration-300 ${copied ? 'bg-green-500 hover:bg-green-600' : 'bg-fuchsia-600 hover:bg-fuchsia-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500`}
              aria-label={copied ? "Copied to clipboard" : "Copy referral link"}
            >
              {copied ? (
                <>
                  <FaCheck className="inline-block mr-2" />
                  Copied
                </>
              ) : (
                <>
                  <FaCopy className="inline-block mr-2" />
                 Copia il link
                </>
              )}
            </button>
          </div>
        </div>

        {/* Invited Users Section */}
        <div className="bg-fuchsia-50 p-6 mt-8 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
          <h2 className="text-xl font-semibold text-fuchsia-700 mb-4">Amici invitati</h2>
          {invitedUsers.length > 0 ? (
            <ul className="space-y-4">
              {invitedUsers.map((user) => (
                <li key={user.id} className="bg-white p-4 rounded-md shadow-sm hover:shadow-md transition-all duration-300 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-fuchsia-700">{user.name}</h3>
                    <p className="text-sm text-gray-600">Joined: {user.registrationDate}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${user.hasPurchased ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {user.hasPurchased ? 'Purchased' : 'Pending'}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center">No invited users yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
