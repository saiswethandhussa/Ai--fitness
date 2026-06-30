import axios from "axios"

const API_URL = 'http://localhost:8080/api/'

const api = axios.create({
  baseURL: API_URL
});

api.interceptors.request.use((config) => {
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  if (userId) {
    config.headers['X-User-ID'] = userId;
  }
  return config;
});

export const getActivities = () => api.get('/activities');
export const getActivity = (id) => api.get(`/activities/${id}`);
export const addActivity = (activity) => api.post('/activities', activity);
export const deleteActivity = (id) => api.delete(`/activities/${id}`);
export const getActivityDetail = (id) => api.get(`/recommendations/activity/${id}`);
export const getUserProfile = (userId) => api.get(`/users/${userId}`);
export const getUserRecommendations = (userId) => api.get(`/recommendations/user/${userId}`);