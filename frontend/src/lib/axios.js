import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:3001/api/v1", // Fix the URL format
  timeout: 10000, // Add timeout
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add better error handling in interceptors
axiosInstance.interceptors.request.use(
  (config) => {
    console.log("Making request to:", config.url); // Debug log
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("Response error:", error);
    if (error.code === "ERR_NETWORK") {
      throw new Error(
        "Unable to connect to the server. Please check if the server is running."
      );
    }
    return Promise.reject(error);
  }
);
