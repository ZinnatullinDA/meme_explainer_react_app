import { baseFetch } from '@/shared/api/base-fetch'

interface RequestConfig {
  data?: unknown
  headers?: HeadersInit
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  params?: Record<string, string | number | boolean | null | undefined>
  timeout?: number
  token?: string
  url: string
}

export function makeRequest<T>({ url, method = 'GET', headers, params, data, token, timeout }: RequestConfig): Promise<T> {
  return baseFetch<T>(url, {
    method,
    headers,
    params,
    token,
    timeout,
    body: data ? JSON.stringify(data) : undefined,
  })
}
