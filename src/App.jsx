import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';

import { BookingProvider } from './context/BookingContext';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import SearchResultsPage from './pages/SearchResultsPage';
import BookingPage from './pages/BookingPage';
import TicketPage from './pages/TicketPage';
import HistoryPage from './pages/HistoryPage';
import SchedulePage from './pages/SchedulePage';
import SupportPage from './pages/SupportPage';
import SettingsPage from './pages/SettingsPage';

function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <BookingProvider>
        <AppLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/results" element={<SearchResultsPage />} />
            <Route path="/booking/:flightId" element={<BookingPage />} />
            <Route path="/ticket/:bookingId" element={<TicketPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </AppLayout>
        <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} />
      </BookingProvider>
    </BrowserRouter>
  );
}

export default App;
