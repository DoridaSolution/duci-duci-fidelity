import React from 'react';

const TimeFilters = ({ currentFilter, setFilter }) => {
  const filters = ['week', 'month', 'year'];

  return (
    <div className="flex justify-center mb-4">
      {filters.map((filter) => (
        <button
          key={filter}
          className={`px-4 py-2 mx-2 rounded ${currentFilter === filter ? 'bg-fuchsia-500 text-white' : 'bg-white text-fuchsia-500 border border-fuchsia-500'}`}
          onClick={() => setFilter(filter)}
        >
          {filter.charAt(0).toUpperCase() + filter.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default TimeFilters;
