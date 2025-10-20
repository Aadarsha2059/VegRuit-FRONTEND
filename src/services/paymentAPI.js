import axios from 'axios';

const API_URL = 'http://localhost:5001/api/payments';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const initializePayment = async (paymentData) => {
    const response = await axios.post(`${API_URL}/initialize`, paymentData, { headers: getAuthHeaders() });
    return response.data.data;
};