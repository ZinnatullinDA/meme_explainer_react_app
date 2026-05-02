import { baseFetch } from './base-fetch'

interface RequestConfig {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  headers?: HeadersInit
  params?: Record<string, string | number | boolean | null | undefined>
  data?: unknown
  token?: string
  timeout?: number
}

export function makeRequest<T>({
  url,
  method = 'GET',
  headers,
  params,
  data,
  token,
  timeout,
}: RequestConfig): Promise<T> {
  return baseFetch<T>(url, {
    method,
    headers,
    params,
    token,
    timeout,
    body: data ? JSON.stringify(data) : undefined,
  })
}
