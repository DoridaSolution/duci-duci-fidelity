import { useState, useEffect } from 'react';

const useFetchUserData = (userId) => {
  const [user, setUser] = useState('');
  const [points, setPoints] = useState(0);
  const [qrCode, setQrCode] = useState('');
  const [products, setProducts] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch profilo utente
        const resProfile = await fetch('/api/users/profile', {
          method: 'GET',
          credentials: 'include',
        });
        if (resProfile.ok) {
          const dataProfile = await resProfile.json();
          setPoints(dataProfile.points);
          setQrCode(dataProfile.qr_code);
          setUser(dataProfile.name);
        } else {
          const errorData = await resProfile.json();
          setAlert({ message: errorData.message || 'Errore nel caricamento del profilo.', type: 'error' });
        }

        // Fetch prodotti
        const resProducts = await fetch('/api/product', {
          method: 'GET',
          credentials: 'include',
        });
        const dataProducts = await resProducts.json();
        if (resProducts.ok) {
          setProducts(dataProducts);
        } else {
          setAlert({ message: dataProducts.message || 'Errore nel caricamento dei prodotti.', type: 'error' });
        }

        // Fetch acquisti
        const resPurchases = await fetch('/api/users/history/qr', {
          method: 'GET',
          credentials: 'include',
        });
        if (resPurchases.ok) {
          const dataPurchases = await resPurchases.json();
          setPurchases(dataPurchases.qrCodes);
        } else {
          const errorPurchases = await resPurchases.json();
          setAlert({ message: errorPurchases.message || 'Errore nel caricamento degli acquisti.', type: 'error' });
        }
      } catch (error) {
        console.error('Errore durante il fetch dei dati:', error);
        setAlert({ message: 'Errore nel caricamento dei dati.', type: 'error' });
      }
    };

    if (userId) fetchData();
  }, [userId]);

  return { user, points, qrCode, products, purchases, alert, setAlert };
};

export default useFetchUserData;
