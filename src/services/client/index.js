// services/client/index.js
import axios from "axios";

import {
  errorInterceptor,
  requestInterceptor,
  responseInterceptor,
} from "./Interceptor";

import { API_URL } from "@/constants/api";

const CLIENT_HOST = API_URL;
const TIMEOUT = 60000; // ms

const mainAxios = axios.create({
  baseURL: CLIENT_HOST,
  validateStatus(status) {
    return status >= 200 && status <= 500;
  },
  timeout: TIMEOUT,
  maxBodyLength: Infinity,
  maxContentLength: Infinity,
  transitional: {
    clarifyTimeoutError: true,
  },
});

mainAxios.defaults.baseURL = CLIENT_HOST;
mainAxios.interceptors.request.use(requestInterceptor, errorInterceptor);
mainAxios.interceptors.response.use(responseInterceptor, errorInterceptor);

export default mainAxios;
