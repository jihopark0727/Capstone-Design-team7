import axios from 'axios';

const API_URL = '/';

export const checkServerStatus = () => {
    return axios.get(`${API_URL}check`);
};

