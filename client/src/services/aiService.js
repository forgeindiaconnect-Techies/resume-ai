import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const API = axios.create({
  baseURL: API_BASE_URL,
});

export const generateResumeAI = (data) => API.post('/ai/generate', data);
export const improveSummary = (data) => API.post('/ai/improve-summary', data);
export const rewriteProject = (data) => API.post('/ai/rewrite-project', data);
export const suggestSkills = (data) => API.post('/ai/suggest-skills', data);
