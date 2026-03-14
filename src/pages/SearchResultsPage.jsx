import React from 'react';
import FlightSearchCard from '../components/FlightSearchCard';
import Main from '../components/Main';

const SearchResultsPage = () => {
  return (
    <div>
      {/* Compact search bar at top */}
      <div style={{ background: 'linear-gradient(135deg, #4361ee 0%, #7209b7 100%)', padding: '20px 28px 20px' }}>
        <FlightSearchCard compact={true} />
      </div>

      <div className="page-content">
        <Main />
      </div>
    </div>
  );
};

export default SearchResultsPage;
