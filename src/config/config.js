import axios from "axios";

export const ip = `http://10.5.5.11:`;

const caxios = axios.create({
  baseURL:ip
});

caxios.interceptors.request.use(
  (req) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  },
  (error) => Promise.reject(error)
);

export default caxios;