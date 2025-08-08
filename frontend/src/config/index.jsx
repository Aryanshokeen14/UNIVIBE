const{default:axios} = require('axios');

export const BASE_URL = "https://univibe-62uf.onrender.com";

export const clientServer = axios.create({
    baseURL : BASE_URL,
});