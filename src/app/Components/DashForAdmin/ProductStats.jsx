import React, { useState, useEffect } from 'react';

const ProductStats = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch dei prodotti dall'API
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/admin/products', { method: 'GET', credentials: 'include' });
        const data = await response.json();
        if (response.ok) {
          setProducts(data);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error('Errore durante il fetch dei prodotti:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow-lg">
      <h2 className="text-xl font-bold mb-4">Gestione Prodotti</h2>
      <table className="w-full text-left table-auto">
        <thead>
          <tr className="bg-fuchsia-500 text-white">
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Nome</th>
            <th className="px-4 py-2">Punti</th>
            <th className="px-4 py-2">Prezzo</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-t">
              <td className="px-4 py-2">{product.id}</td>
              <td className="px-4 py-2">{product.name}</td>
              <td className="px-4 py-2">{product.points}</td>
              <td className="px-4 py-2">{product.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductStats;
