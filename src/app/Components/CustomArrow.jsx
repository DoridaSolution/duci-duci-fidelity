// src/app/Components/CustomArrow.jsx

import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const CustomArrow = ({ className, style, onClick, direction }) => {
  return (
    <div
      className={`${className} custom-arrow`}
      style={{ 
        ...style, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'rgba(236, 72, 153, 0.8)', // Fucsia con trasparenza
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        zIndex: 1,
      }}
      onClick={onClick}
    >
      {direction === 'next' ? (
        <FaChevronRight className="text-white" size={20} />
      ) : (
        <FaChevronLeft className="text-white" size={20} />
      )}
    </div>
  );
};

export default CustomArrow;
