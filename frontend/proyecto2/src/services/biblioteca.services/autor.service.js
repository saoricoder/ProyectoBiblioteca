import axios from 'axios';

const API_URL = 'http://localhost:5000/api/autor';

export const getAutores = () => {
    return axios.get(API_URL);
};

export const postAutor = (autor) => {
    return axios.post(API_URL, autor);
};