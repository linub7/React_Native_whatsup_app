import axios from 'axios';
import { API } from '../config';

// API = local machine IPV4

const client = axios.create({
  baseURL: `${API}/api/v1`,
});

export default client;
