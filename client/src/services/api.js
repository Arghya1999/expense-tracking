
import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/expenses';

export const getExpenses = (startDate = '', endDate = '') => {
    let url = API_URL;
    const params = new URLSearchParams();

    if (startDate) {
        params.append('startDate', startDate);
    }
    if (endDate) {
        params.append('endDate', endDate);
    }

    if (params.toString()) {
        url = `${API_URL}?${params.toString()}`;
    }
    return axios.get(url, { headers: authHeader() });
};

export const createExpense = (expense) => {
    return axios.post(API_URL, expense, { headers: authHeader() });
};

export const updateExpense = (id, expense) => {
    return axios.put(`${API_URL}/${id}`, expense, { headers: authHeader() });
};

export const deleteExpense = (id) => {
    return axios.delete(`${API_URL}/${id}`, { headers: authHeader() });
};
