import axios from "axios";

export const caxios = axios.create({
  baseURL: `http://10.5.5.12`
});

// export const caxios = axios.create({
//   baseURL: `http://192.168.219.108`
// });

caxios.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `bearer ${token}`;
  }
  return config;
});
