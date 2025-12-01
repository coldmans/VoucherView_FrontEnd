import { API_BASE_URL } from '../config/api';

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface ApiClientOptions {
  headers?: HeadersInit;
  timeout?: number;
}

class ApiClient {
  private baseUrl: string;
  private defaultHeaders: HeadersInit;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    requireAuth: boolean = false
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      ...this.defaultHeaders,
      ...options.headers,
    };

    // JWT 토큰이 필요한 경우 Authorization 헤더 추가
    if (requireAuth) {
      const token = localStorage.getItem('token');
      if (token) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
      }
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        // 에러 메시지 추출 (다양한 형식 지원)
        const errorMessage =
          errorData?.message ||
          errorData?.error ||
          errorData?.msg ||
          `HTTP error! status: ${response.status}`;

        throw new ApiError(
          errorMessage,
          response.status,
          errorData
        );
      }

      // 204 No Content 응답 처리
      if (response.status === 204) {
        return undefined as T;
      }

      // Content-Length가 0이거나 응답 본문이 비어있는 경우 처리
      const contentLength = response.headers.get('Content-Length');
      if (contentLength === '0') {
        return undefined as T;
      }

      // 응답 본문이 있는지 확인
      const text = await response.text();
      if (!text || text.trim() === '') {
        return undefined as T;
      }

      // JSON 파싱 시도
      try {
        return JSON.parse(text);
      } catch (e) {
        // JSON 파싱 실패 시 텍스트 그대로 반환
        return text as T;
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error instanceof Error ? error.message : 'Network request failed'
      );
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>, requireAuth: boolean = false): Promise<T> {
    const queryString = params
      ? '?' +
        Object.entries(params)
          .filter(([_, value]) => value !== undefined && value !== null)
          .map(
            ([key, value]) =>
              `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
          )
          .join('&')
      : '';

    return this.request<T>(`${endpoint}${queryString}`, {
      method: 'GET',
    }, requireAuth);
  }

  async post<T>(endpoint: string, data?: unknown, requireAuth: boolean = false): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }, requireAuth);
  }

  async put<T>(endpoint: string, data?: unknown, requireAuth: boolean = false): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }, requireAuth);
  }

  async delete<T>(endpoint: string, requireAuth: boolean = false): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    }, requireAuth);
  }

  setBaseUrl(url: string) {
    this.baseUrl = url;
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }
}

export const apiClient = new ApiClient();
