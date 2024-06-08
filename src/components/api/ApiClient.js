import axios from 'axios'

export const apiClient = axios.create(
    {
        baseURL: 'http://54.235.224.83:8080'
    }
);
