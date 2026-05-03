interface BaseFetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | null | undefined>
  timeout?: number
  token?: string
}

export async function baseFetch<T>(input: string, options: BaseFetchOptions = {}): Promise<T> {
  const { timeout = 8000, params, token, headers, body, ...requestInit } = options

  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), timeout)
  const baseUrl = import.meta.env.VITE_API_BASE_URL ?? window.location.origin
  const url = new URL(input, baseUrl)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value))
      }
    })
  }

  try {
    const hasBody = body !== undefined

    const response = await fetch(url.toString(), {
      ...requestInit,
      signal: controller.signal,
      headers: {
        ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body,
    })

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }

    if (response.status === 204) {
      return undefined as T
    }

    return (await response.json()) as T
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout exceeded')
    }

    throw error
  } finally {
    window.clearTimeout(timeoutId)
  }
}
