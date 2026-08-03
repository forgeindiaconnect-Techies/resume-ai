import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const API = axios.create({
  baseURL: API_BASE_URL,
});

export const getTemplates = () => API.get('/templates');
export const getTemplateById = (id) => API.get(`/templates/${id}`);
export const createTemplate = (data) => API.post('/templates', data);
export const updateTemplate = (id, data) => API.put(`/templates/${id}`, data);
export const deleteTemplate = (id) => API.delete(`/templates/${id}`);
export const useTemplate = (id, data) => API.post(`/templates/${id}/use`, data);
