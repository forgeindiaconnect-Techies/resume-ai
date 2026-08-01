import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// GET all examples
export const getExamples = async () => {
  try {
    const res = await API.get('/examples');
    return res.data.data || [];
  } catch (error) {
    console.error('getExamples API error:', error);
    return [];
  }
};

// GET examples by category
export const getExamplesByCategory = async (category) => {
  try {
    const res = await API.get(`/examples/category/${encodeURIComponent(category)}`);
    return res.data.data || [];
  } catch (error) {
    console.error('getExamplesByCategory API error:', error);
    return [];
  }
};

// GET example by ID
export const getExampleById = async (id) => {
  try {
    const res = await API.get(`/examples/${id}`);
    return res.data.data || null;
  } catch (error) {
    console.error('getExampleById API error:', error);
    return null;
  }
};

// Search examples
export const searchExamples = async (query) => {
  try {
    const res = await API.get(`/examples/search?q=${encodeURIComponent(query)}`);
    return res.data.data || [];
  } catch (error) {
    console.error('searchExamples API error:', error);
    return [];
  }
};

// POST create example
export const createExample = async (data) => {
  try {
    const res = await API.post('/examples', data);
    return res.data;
  } catch (error) {
    console.error('createExample API error:', error);
    throw error;
  }
};

// PUT update example
export const updateExample = async (id, data) => {
  try {
    const res = await API.put(`/examples/${id}`, data);
    return res.data;
  } catch (error) {
    console.error('updateExample API error:', error);
    throw error;
  }
};

// DELETE example
export const deleteExample = async (id) => {
  try {
    const res = await API.delete(`/examples/${id}`);
    return res.data;
  } catch (error) {
    console.error('deleteExample API error:', error);
    throw error;
  }
};

// Cloudinary image upload helper
export const uploadPreviewImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    const res = await API.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  } catch (error) {
    console.error('uploadPreviewImage error:', error);
    throw error;
  }
};
