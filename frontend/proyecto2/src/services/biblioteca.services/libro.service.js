import axios from 'axios';

const API_URL = 'http://localhost:5000/api/libro';

export const getLibros = () => {
    return axios.get(API_URL);
};

export const postLibro = (libro) => {
    return axios.post(API_URL, libro);
};