import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  Method,
} from "axios";
import { toast } from "react-hot-toast";

const formattedExceptions: { [key: string]: string } = {
  // "400|060915": "Details not found",
};

const toastExceptions = ["400|060915", "400|060904", "403|000010"];

// Hàm lấy baseURL động
const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_BASE_API_BASE || "";
  }
  return (
    process.env.NEXT_PUBLIC_BASE_API_BASE ||
    process.env.NEXTAUTH_URL ||
    "http://localhost:3000"
  );
};

class AuthenticationManager {
  static getToken() {
    if (typeof window === "undefined") return undefined;
    return localStorage.getItem("accessToken");
  }

  static async refreshToken() {
    await new Promise((res) => setTimeout(res, 200));
    localStorage.setItem("accessToken", "token-demo-new");
  }
}

export const request: AxiosInstance = axios.create({
  baseURL: getBaseUrl(),
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

request.interceptors.request.use(async (config) => {
  const token = AuthenticationManager.getToken();
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

request.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await AuthenticationManager.refreshToken();
        originalRequest.headers.Authorization = `Bearer ${AuthenticationManager.getToken()}`;
        return request(originalRequest);
      } catch (refreshError) {
        toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorCode: string = error?.response?.data?.error?.code;
    const errorMessage =
      formattedExceptions[errorCode] ||
      error?.response?.statusText ||
      error?.message ||
      "Unknown error!";

    if (!toastExceptions.includes(errorCode)) {
      toast.error(errorMessage);
    }

    return Promise.reject(error);
  }
);

export const fetcher = (url: string, config: AxiosRequestConfig = {}) =>
  request(url, config)
    .then((res) => res?.data)
    .catch((err) => {
      throw err;
    });

export const fetchFormData = async ({
  url,
  formData,
  method = "POST",
}: {
  url: string;
  formData: FormData;
  method?: Method;
}) => {
  if (!formData || [...formData.entries()].length === 0) {
    throw new Error("FormData cannot be empty.");
  }
  return request({
    url,
    method,
    data: formData,
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export default request;
