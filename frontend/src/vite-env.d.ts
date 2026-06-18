/// <reference types="vite/client" />

declare module '@/services/api' {
  import type { AxiosInstance } from 'axios';
  const api: AxiosInstance;
  export default api;
}
