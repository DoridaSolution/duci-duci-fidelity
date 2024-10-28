import React, { useState, useEffect } from 'react';
import ReferralManagement from '../../Components/ReferallManagment';

const ReferralComponent = () => {
  const [referralData, setReferralData] = useState({});
  const [invitedUsers, setInvitedUsers] = useState([]);

  useEffect(() => {
    const fetchReferralDetails = async () => {
      try {
        const res = await fetch('/api/users/referalls/referral-details', {
          method: 'GET',
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          setReferralData(data);
          setInvitedUsers(data.invitedUsers);
        } else {
          console.error('Errore nel caricamento dei dettagli referral');
        }
      } catch (error) {
        console.error('Errore nel caricamento dei dettagli referral:', error);
      }
    };

    fetchReferralDetails();
  }, []);

  return (
    <ReferralManagement
      referralData={referralData}
      invitedUsers={invitedUsers}
    />
  );
};

export default ReferralComponent;
