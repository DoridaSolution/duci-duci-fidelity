// app/components/QRCodeScanner.js
'use client';

import { useState } from 'react';
import QrReader from 'react-qr-reader';

export default function QRCodeScanner({ onScan }) {
  const [error, setError] = useState(null);

  const handleScan = (data) => {
    if (data) {
      onScan(data);
    }
  };

  const handleError = (err) => {
    setError(err);
  };

  return (
    <div>
      <QrReader
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: '100%' }}
      />
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
    </div>
  );
}
