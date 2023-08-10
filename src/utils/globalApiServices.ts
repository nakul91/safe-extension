import { AxiosResponse } from "axios";
import { TResponse } from "../types";
import axiosInstance from "./httpInterceptor";

export const globalGetService = <TParamType>(
  url: string,
  params: TParamType,
  baseURL: string | undefined = axiosInstance.defaults.baseURL
): Promise<TResponse> => {
  return new Promise(function (resolve, reject) {
    axiosInstance({
      method: "GET",
      url: url,
      params: params,
      baseURL: baseURL,
    })
      .then((response: AxiosResponse<TResponse>) => {
        resolve(response as any);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const globalApiService = <TDataType>(
  url: string,
  data: TDataType,
  baseURL: string | undefined = axiosInstance.defaults.baseURL,
  method: string
): Promise<TResponse> => {
  return new Promise(function (resolve, reject) {
    axiosInstance({
      method: method,
      url: url,
      data: data,
      baseURL: baseURL,
    })
      .then((response: AxiosResponse<TResponse>) => {
        resolve(response as any);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
