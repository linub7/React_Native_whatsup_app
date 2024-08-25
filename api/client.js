import axios from 'axios';
import { APP_BACKEND_PRODUCTION_URL } from '@env';

// API = local machine IPV4

const baseURL = `${APP_BACKEND_PRODUCTION_URL}/api/v1`;

const client = axios.create({
  baseURL,
});

export default client;
