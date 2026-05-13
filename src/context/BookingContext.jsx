import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { bookingService } from '../services/bookingService';

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [searchParams, setSearchParams] = useState({ from: '', to: '', date: '', passengers: 1 });
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all bookings from JSON Server on mount
  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookingService.getAll();
      // Sort newest first
      setBookings(data.sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt)));
    } catch (err) {
      console.warn('API unavailable — using localStorage fallback.');
      // Graceful fallback to localStorage if API is not running
      try {
        setBookings(JSON.parse(localStorage.getItem('fa_bookings') || '[]'));
      } catch { setBookings([]); }
      setError('offline');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const addBooking = async (booking) => {
    try {
      const saved = await bookingService.add(booking);
      setBookings(prev => [saved, ...prev]);
      return saved;
    } catch {
      // Fallback for offline mode
      setBookings(prev => {
        const next = [booking, ...prev];
        localStorage.setItem('fa_bookings', JSON.stringify(next));
        return next;
      });
      return booking;
    }
  };

  const removeBooking = async (id) => {
    try {
      await bookingService.remove(id);
    } catch { /* offline, just update state */ }
    setBookings(prev => {
      const next = prev.filter(b => b.id !== id);
      localStorage.setItem('fa_bookings', JSON.stringify(next));
      return next;
    });
  };

  const getBookingById = (id) => bookings.find(b => b.id === id);

  return (
    <BookingContext.Provider value={{
      searchParams, setSearchParams,
      searchResults, setSearchResults,
      selectedFlight, setSelectedFlight,
      bookings, addBooking, removeBooking, getBookingById,
      loading, error, refetchBookings: fetchBookings,
    }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within BookingProvider');
  return ctx;
}
