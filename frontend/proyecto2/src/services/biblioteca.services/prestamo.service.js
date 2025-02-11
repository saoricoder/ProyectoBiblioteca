import axios from 'axios';

const API_URL = 'http://localhost:5000/api/prestamo';

export const getPrestamos = () => {
    return axios.get(API_URL);
};

export const postPrestamo = (prestamo) => {
    return axios.post(API_URL, prestamo);
};