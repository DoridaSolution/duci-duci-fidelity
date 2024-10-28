import React, { useState, useEffect } from 'react';

const ProductAnalysis = () => {
  const [topProducts, setTopProducts] = useState([]);
  const [highConversionProducts, setHighConversionProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);

  useEffect(() => {
    const fetchProductStats = async () => {
      try {
        const response = await fetch('/api/admin/productsanaly', { credentials: 'include' });
        const data = await response.json();
        if (response.ok) {
          setTopProducts(data.topProducts);
          setHighConversionProducts(data.highConversionProducts);
          setTrendingProducts(data.trendingProducts);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error('Errore durante il fetch delle statistiche dei prodotti:', error);
      }
    };

    fetchProductStats();
  }, []);

  return (
    <div className="bg-white p-6 rounded shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Analisi dei Prodotti</h2>
      <div className="mb-6">
        <h3 className="text-xl font-semibold">Prodotti Più Acquistati</h3>
        <ul className="mt-2">
          {topProducts.map((product) => (
            <li key={product.name} className="mb-1 text-gray-700">
              {product.name}: {product.purchase_count} acquisti (Media valutazioni: {product.avg_rating || 'N/A'})
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold">Prodotti con Più Conversioni e Sconti Applicati</h3>
        <ul className="mt-2">
          {highConversionProducts.map((product) => (
            <li key={product.name} className="mb-1 text-gray-700">
              {product.name}: {product.purchase_count} acquisti (Sconto medio: {product.avg_discount || 0}%)
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-xl font-semibold">Prodotti in Tendenza</h3>
        <ul className="mt-2">
          {trendingProducts.map((product) => (
            <li key={product.name} className="mb-1 text-gray-700">
              {product.name}: {product.purchase_count_last_week} acquisti nell'ultima settimana
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductAnalysis;
