// src/services/ClientService.js
import axios from 'axios';

const API_URL = '/api/clients';

const getClientsByCounselor = (counselorId) => {
    return axios.get(`${API_URL}/counselor/${counselorId}`);
};

export default {
    getClientsByCounselor,
};
