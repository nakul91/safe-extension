import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

import { TApiResponse } from "../types";

const axiosInstance: AxiosInstance = axios.create();
export const baseURLv2: string | undefined = "";

axiosInstance.defaults.baseURL = ``;
axiosInstance.interceptors.request.use(
  //@ts-ignore
  function (config: AxiosRequestConfig) {
    config.headers = {
      "x-api-key": "123",
    };
    return config;
  },
  function (error: AxiosError) {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  function (response: AxiosResponse<TApiResponse>) {
    if (response.status >= 200 && response.status <= 299) {
      return response;
    } else {
      return response;
    }
  },
  function (error: AxiosError) {
    return Promise.reject(error);
  }
);

export default axiosInstance;
