export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(endpoint, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

export async function apiBinaryRequest(endpoint: string, options: RequestInit = {}): Promise<ArrayBuffer> {
  const response = await fetch(endpoint, options)

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }

  return response.arrayBuffer()
}

export function createFormData(data: Record<string, any>): FormData {
  const formData = new FormData()

  Object.entries(data).forEach(([key, value]) => {
    if (value instanceof File || value instanceof Blob) {
      formData.append(key, value)
    } else {
      formData.append(key, String(value))
    }
  })

  return formData
}
