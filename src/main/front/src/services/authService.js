import axios from 'axios';

const API_URL = '/api/auth';

export const signUp = (data) => {
    return axios.post(`${API_URL}/signUp`, data);
};

export const login = (data) => {
    return axios.post(`${API_URL}/login`, data);
};
