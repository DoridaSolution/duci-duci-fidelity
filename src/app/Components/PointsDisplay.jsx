// app/components/PointsDisplay.js
'use client';

import { useState, useEffect } from 'react';

export default function PointsDisplay({ userId }) {
  const [points, setPoints] = useState(0);

  useEffect(() => {
    async function fetchPoints() {
      const res = await fetch(`/api/users/${userId}/points`);
      const data = await res.json();
      if (res.ok) {
        setPoints(data.points);
      }
    }
    
    fetchPoints();
  }, [userId]);

  return (
    <div>
      <h3>Points: {points}</h3>
    </div>
  );
}
