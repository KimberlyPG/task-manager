export interface IApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  count?: number;
}

export interface IErrorResponse {
  success: false;
  message: string;
  error?: string;
}
