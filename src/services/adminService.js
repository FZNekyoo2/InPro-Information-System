
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
};

export const getAdmins = async () => {
    const response = await axios.get(`${API_URL}/admin/users`, {
        headers: getAuthHeader(),
    });
    return response.data;
};

export const createAdmin = async (adminData) => {
    const response = await axios.post(`${API_URL}/admin/users`, adminData, {
        headers: getAuthHeader(),
    });
    return response.data;
};

export const deleteAdmin = async (id) => {
    const response = await axios.delete(`${API_URL}/admin/users/${id}`, {
        headers: getAuthHeader(),
    });
    return response.data;
};

export const getActivityLogs = async () => {
    const response = await axios.get(`${API_URL}/admin/logs`, {
        headers: getAuthHeader(),
    });
    return response.data;
};
