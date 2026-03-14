import api from './api';

export const bookingService = {
  getAll: () => api.get('/bookings').then(r => r.data),
  getById: (id) => api.get(`/bookings/${id}`).then(r => r.data),
  add: (booking) => api.post('/bookings', booking).then(r => r.data),
  remove: (id) => api.delete(`/bookings/${id}`).then(r => r.data),
};
