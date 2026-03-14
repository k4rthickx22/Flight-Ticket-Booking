import api from './api';

export const userService = {
  getProfile: () => api.get('/users/1').then(r => r.data),
  updateProfile: (data) => api.put('/users/1', data).then(r => r.data),
};
