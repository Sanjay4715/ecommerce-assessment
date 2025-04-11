import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { deleteCookie, getCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://fakestoreapi.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Extend the config type to include authentication requirement flag
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  requiresAuth?: boolean;
}

// Interface for decoded JWT token
interface DecodedToken {
  exp?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

// Request interceptor with conditional token handling
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // Type assertion to access our custom property
    const customConfig = config as CustomAxiosRequestConfig;

    // Skip auth for endpoints that don't require it
    if (customConfig.requiresAuth === false) {
      return config;
    }

    // Default to true if not specified
    const requiresAuth =
      customConfig.requiresAuth !== undefined
        ? customConfig.requiresAuth
        : false;

    if (requiresAuth) {
      const token = getCookie("accessToken") as string | undefined;

      if (token) {
        const decodedToken: DecodedToken = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        if (decodedToken.exp && decodedToken.exp < currentTime) {
          // If token is expired, log out the user
          if (typeof window !== "undefined") {
            deleteCookie("accessToken");
            deleteCookie("user");
            window.location.href = "/admin"; // Redirect to login page or show a modal
          }
        }
        if (config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      // Optional: throw error if token is required but missing
      if (!token && process.env.NODE_ENV === "development") {
        console.warn("Authentication token missing for protected endpoint");
      }
    }

    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    // Return a properly structured AxiosResponse
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      config: response.config,
      request: response.request,
    };
  },
  (error: AxiosError): Promise<AxiosError> => {
    // Default to true if not specified
    if (error.response?.status === 401) {
      // Handle unauthorized access
      if (typeof window !== "undefined") {
        // Redirect to login or show modal
        // window.location.href =
        //   "/admin?redirect=" + encodeURIComponent(window.location.pathname);
      }
    }
    return Promise.reject(error);
  }
);

// Type augmentation for axios to recognize our custom config
declare module "axios" {
  interface AxiosRequestConfig {
    requiresAuth?: boolean;
  }
}

export default api;
