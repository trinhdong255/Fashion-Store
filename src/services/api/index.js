import { createApi } from "@reduxjs/toolkit/query/react";
import axios from "axios";

export const axiosBaseQuery =
  () =>
  async ({ url, method, data, params, headers }) => {
    try {
      // Danh sách các endpoint không yêu cầu token
      const publicEndpoints = [
        "/v1/auth/login",
        "/v1/auth/register",
        "/v1/auth/register/verify",
        "/v1/auth/forgot-password",
        "/v1/auth/forgot-password/verify-code",
        "/v1/auth/forgot-password/reset-password",
      ];

      const token = localStorage.getItem("accessToken");
      console.log(`Token trước khi gửi request (${url}):`, token);

      // Chỉ kiểm tra token nếu endpoint không nằm trong danh sách public
      if (!publicEndpoints.includes(url) && !token) {
        return {
          error: {
            status: 401,
            data: { message: "Không tìm thấy token, vui lòng đăng nhập lại" },
          },
        };
      }

      const config = {
        url,
        method,
        data,
        params,
        headers: {
          ...headers,
          // Chỉ thêm Authorization header nếu có token và endpoint không công khai
          ...(token && !publicEndpoints.includes(url) && { Authorization: `Bearer ${token}` }),
        },
        baseURL: import.meta.env.VITE_API_URL,
      };

      if (data instanceof FormData) {
        delete config.headers["Content-Type"];
      }

      console.log("Axios request config:", config);
      console.log("Full request URL:", `${config.baseURL}${config.url}`);

      const result = await axios(config);

      if (result.status >= 400) {
        console.log("Axios response error:", result);
        console.log("Server received path:", result.data?.path || "N/A");
        return {
          error: {
            status: result.status,
            data: result.data,
          },
        };
      }

      console.log("Axios response success:", result.data);
      return { data: result.data };
    } catch (axiosError) {
      const error = {
        status: axiosError.response?.status,
        data: axiosError.response?.data || axiosError.message,
      };

      console.error("Axios error:", error);

      // Chỉ xóa token và chuyển hướng nếu lỗi là do token không hợp lệ
      if (
        error.status === 401 &&
        (error.data?.message === "Không tìm thấy token, vui lòng đăng nhập lại" ||
          error.data?.message?.includes("Invalid token"))
      ) {
        console.log("Xóa token do lỗi 401:", error.data?.message);
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
      }

      return { error };
    }
  };

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery(),
  endpoints: () => ({}),
  tagTypes: [
    "User",
    "Product",
    "ProductVariant",
    "ProductImage",
    "Color",
    "Size",
    "Cart",
    "Role",
    "Categories",
    "Ward",
    "District",
    "Province",
    "Order",
    "OrderItem",
    "Promotion",
  ],
});