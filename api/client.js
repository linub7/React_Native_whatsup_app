import axios from 'axios';
import {
  APP_DEVELOPMENT,
  APP_BACKEND_DEVELOPMENT_URL,
  APP_BACKEND_PRODUCTION_URL,
} from '@env';

// API = local machine IPV4

const client = axios.create({
  baseURL: `${
    APP_DEVELOPMENT ? APP_BACKEND_DEVELOPMENT_URL : APP_BACKEND_PRODUCTION_URL
  }/api/v1`,
});

export default client;
