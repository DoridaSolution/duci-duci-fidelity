"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Importa il router corretto

const useAuth = (requiredRole = null) => {
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Stato di caricamento
  const router = useRouter(); // Usa il router di next/navigation

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/check', {
          method: 'GET',
          credentials: 'include', // Includi i cookie per il token
        });

        if (!res.ok) {
          throw new Error('Non autenticato');
        }

        const data = await res.json();
        setUserRole(data.role);
        setIsAuthenticated(true);

        // Se è richiesto un ruolo specifico e l'utente non lo ha, reindirizza
        if (requiredRole && data.role !== requiredRole) {
          router.push('/');
        }
      } catch (error) {
        console.error('Errore durante la verifica dell\'autenticazione:', error);
        router.push('/login'); // Reindirizza se non autenticato
      } finally {
        setLoading(false); // Imposta il caricamento a false dopo la verifica
      }
    };

    checkAuth();
  }, [router, requiredRole]);

  return { isAuthenticated, userRole, loading };
};

export default useAuth;
