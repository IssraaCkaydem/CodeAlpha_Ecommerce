import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("API Error:", error.response?.data);
    return Promise.reject(error);
  }
);

export default axiosClient;
