import React from 'react';
import FlightSearchCard from '../components/FlightSearchCard';
import Main from '../components/Main';

const SearchResultsPage = () => {
  return (
    <div>
      {/* Compact dark navy search bar */}
      <div style={{
        background: 'var(--navy-mid)',
        borderBottom: '1px solid var(--border)',
        padding: '20px 28px',
      }}>
        <FlightSearchCard compact={true} />
      </div>

      <div className="page-content">
        <Main />
      </div>
    </div>
  );
};

export default SearchResultsPage;
