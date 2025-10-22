import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { getAuthToken } from "../contexts/AuthContext";
import { API_CONFIG } from "../config/api";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = getAuthToken();

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      if (API_CONFIG.DEBUG) {
        console.log("API Request:", {
          method: config.method?.toUpperCase(),
          url: config.url,
          data: config.data,
          headers: config.headers.Authorization ? "Token present" : "No token",
        });
      }

      return config;
    } catch (error) {
      console.error("Error in request interceptor:", error);
      return config;
    }
  },
  (error: AxiosError) => {
    if (API_CONFIG.DEBUG) {
      console.error("Request Error:", error);
    }
    return Promise.reject(error);
  }
);

/**
 * Response interceptor to handle errors and token expiration
 *
 * This interceptor:
 * - Logs response details in debug mode
 * - Handles HTTP error status codes
 * - Manages token expiration (401)
 * - Provides user-friendly error messages
 */
axiosInstance.interceptors.response.use(
  (response) => {
    if (API_CONFIG.DEBUG) {
      console.log("API Response:", {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }
    return response;
  },
  async (error: AxiosError) => {
    if (API_CONFIG.DEBUG) {
      console.error("❌ Response Error:", {
        status: error.response?.status,
        url: error.config?.url,
        data: error.response?.data,
      });
    }

    // Handle specific error cases
    if (error.response) {
      const status = error.response.status;

      switch (status) {
        case 401:
          // Unauthorized - Token expired or invalid
          // Note: Actual logout should be handled by the component using useAuth()
          console.error("Unauthorized - Token may be expired");
          break;
        case 403:
          // Forbidden - Valid token but insufficient permissions
          console.error("Access forbidden - Insufficient permissions");
          break;
        case 404:
          // Not found - Resource doesn't exist
          console.error("Resource not found");
          break;
        case 500:
          // Server error - MockAPI service issue
          console.error("Server error - Please try again later");
          break;
        case 503:
          // Service unavailable
          console.error("Service temporarily unavailable");
          break;
        default:
          console.error("API Error:", error.message);
      }
    } else if (error.request) {
      // Network error - No response received
      console.error("Network error - Please check your internet connection");
    } else {
      // Other errors - Request setup issue
      console.error("Request Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
