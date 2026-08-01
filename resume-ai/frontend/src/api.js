import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
});

export const analyzeResume = (file, role) => {
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('role', role);

    return api.post('/analyze', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export default api;
