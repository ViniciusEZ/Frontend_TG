import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { getUser } from '@/utils/rest';

const baseUrl = import.meta.env.BACKEND_URL || 'http://localhost:8000';

export const useUserStore = defineStore('user', () => {
  const router = useRouter();

  const accessToken = ref(localStorage.getItem('accessToken') || '');
  const refreshToken = ref(localStorage.getItem('refreshToken') || '');
  const userFromStorage = localStorage.getItem('user');
  const user = ref(userFromStorage !=='undefined' ? JSON.parse(userFromStorage) : null);

  const isAuthenticated = ref(!!accessToken.value);

  const login = async ({ email, password }) => {
    try {
      const response = await axios.post(`${baseUrl}/user/token/obtain/`, {
        email,
        password,
      });
      accessToken.value = response.data.access;
      refreshToken.value = response.data.refresh;
      isAuthenticated.value = true;

      localStorage.setItem('accessToken', accessToken.value);
      localStorage.setItem('refreshToken', refreshToken.value);
     
      const userData = await getUser(email);
      
      user.value = userData;
      localStorage.setItem('user', JSON.stringify(userData));
      console.log(userData);
    } catch (error) {
      console.log(error);
      logout();
      console.log(error)
      throw error;
    }
  };

  const logout = () => {
    accessToken.value = '';
    refreshToken.value = '';
    isAuthenticated.value = false;
    user.value = null;

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    router.push({ name: 'login' });
  };

  const refreshAccessToken = async () => {
    try {
      const response = await axios.post(`${baseUrl}/user/token/refresh/`, {
        refresh: refreshToken.value,
      });
      accessToken.value = response.data.access;
      localStorage.setItem('accessToken', accessToken.value);
    } catch (error) {
      logout();
      throw error;
    }
  };

  axios.interceptors.request.use(
    config => {
      if (accessToken.value) {
        config.headers.Authorization = `Bearer ${accessToken.value}`;
      }
      return config;
    },
    error => Promise.reject(error)
  );

  axios.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;
      if (
        error.response &&
        error.response.status === 401 &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;
        try {
          await refreshAccessToken();
          originalRequest.headers.Authorization = `Bearer ${accessToken.value}`;
          return axios(originalRequest);
        } catch (refreshError) {
          logout();
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );

  return {
    accessToken,
    refreshToken,
    user,
    isAuthenticated,
    login,
    logout,
  };
});
