import axios from 'axios'

export const apiClient = axios.create(
    {
        baseURL: 'http://107.20.240.135:8080'
    }
);
