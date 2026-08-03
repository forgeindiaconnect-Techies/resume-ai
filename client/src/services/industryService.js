import { API_BASE_URL } from '../config/api';

export const getIndustries = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/industries`);
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching industries:', error);
    return [];
  }
};

export const getExamplesByIndustry = async (industryId) => {
  try {
    const res = await fetch(`${API_BASE_URL}/industries/${industryId}/examples`);
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error(`Error fetching examples for industry ${industryId}:`, error);
    return [];
  }
};

export const getExampleById = async (id) => {
  try {
    const res = await fetch(`${API_BASE_URL}/resume-examples/${id}`);
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error(`Error fetching resume example ${id}:`, error);
    return null;
  }
};

// Admin services
export const createIndustry = async (payload) => {
  try {
    const res = await fetch(`${API_BASE_URL}/industries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (error) {
    console.error('Error creating industry:', error);
    return { success: false, message: error.message };
  }
};

export const deleteIndustry = async (id) => {
  try {
    const res = await fetch(`${API_BASE_URL}/industries/${id}`, {
      method: 'DELETE'
    });
    return await res.json();
  } catch (error) {
    console.error('Error deleting industry:', error);
    return { success: false, message: error.message };
  }
};

export const createResumeExample = async (payload) => {
  try {
    const res = await fetch(`${API_BASE_URL}/resume-examples`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (error) {
    console.error('Error creating resume example:', error);
    return { success: false, message: error.message };
  }
};

export const updateResumeExample = async (id, payload) => {
  try {
    const res = await fetch(`${API_BASE_URL}/resume-examples/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (error) {
    console.error('Error updating resume example:', error);
    return { success: false, message: error.message };
  }
};

export const deleteResumeExample = async (id) => {
  try {
    const res = await fetch(`${API_BASE_URL}/resume-examples/${id}`, {
      method: 'DELETE'
    });
    return await res.json();
  } catch (error) {
    console.error('Error deleting resume example:', error);
    return { success: false, message: error.message };
  }
};
