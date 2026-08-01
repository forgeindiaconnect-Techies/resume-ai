import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const generateResumeAI = (data) => API.post('/ai/generate', data);
export const improveSummary = (data) => API.post('/ai/improve-summary', data);
export const rewriteProject = (data) => API.post('/ai/rewrite-project', data);
export const suggestSkills = (data) => API.post('/ai/suggest-skills', data);
