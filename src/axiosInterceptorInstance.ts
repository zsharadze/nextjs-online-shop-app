import axios from "axios";
import { showToastError } from "./app/helpers/toastService";

const axiosInterceptorInstance = axios.create({
  baseURL: process.env.BASE_API_URL,
});

// Request interceptor
axiosInterceptorInstance.interceptors.request.use(
  (config) => {
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  (error) => {
    console.log("Error during request", error);
    // Handle request errors here
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInterceptorInstance.interceptors.response.use(
  (response) => {
    // Modify the response data here
    return response;
  },
  (error) => {
    console.log("Error during response", error);
    if (error.status === 400) {
      showToastError(error?.response?.data);
    }
    // Handle response errors here
    return Promise.reject(error);
  }
);

export default axiosInterceptorInstance;
