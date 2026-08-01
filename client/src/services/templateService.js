import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const getTemplates = () => API.get('/templates');
export const getTemplateById = (id) => API.get(`/templates/${id}`);
export const createTemplate = (data) => API.post('/templates', data);
export const updateTemplate = (id, data) => API.put(`/templates/${id}`, data);
export const deleteTemplate = (id) => API.delete(`/templates/${id}`);
export const useTemplate = (id, data) => API.post(`/templates/${id}/use`, data);
