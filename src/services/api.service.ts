
import api from '../api/config';

const API = {
  get: (url: string) => api.get(url),
  post: (url: string, data?: any) => api.post(url, data),
  put: (url: string, data?: any) => api.put(url, data),
  delete: (url: string) => api.delete(url),
};

export default API;
