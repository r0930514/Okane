// 通用類型定義

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface RequestOptions {
  cache?: RequestCache;
  revalidate?: number | false;
  tags?: string[];
}

export interface ErrorResponse {
  success: false;
  error: string;
  statusCode?: number;
  timestamp?: string;
}