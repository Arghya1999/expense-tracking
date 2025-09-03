
import axios from 'axios';
import authHeader from './auth-header';
import { API_BASE_URL } from '../config';

export const getExpenses = (startDate = '', endDate = '') => {
    let url = `${API_BASE_URL}/expenses`;
    const params = new URLSearchParams();

    if (startDate) {
        params.append('startDate', startDate);
    }
    if (endDate) {
        params.append('endDate', endDate);
    }

    if (params.toString()) {
        url = `${url}?${params.toString()}`;
    }
    return axios.get(url, { headers: authHeader() });
};

export const createExpense = (expense) => {
    return axios.post(`${API_BASE_URL}/expenses`, expense, { headers: authHeader() });
};

export const updateExpense = (id, expense) => {
    return axios.put(`${API_BASE_URL}/expenses/${id}`, expense, { headers: authHeader() });
};

export const deleteExpense = (id) => {
    return axios.delete(`${API_BASE_URL}/expenses/${id}`, { headers: authHeader() });
};
