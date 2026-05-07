const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function apiFetch(endpoint, options = {}) {

  const token = localStorage.getItem("token")

  const headers = {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json"
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  const text = await response.text()

  console.log("RESPUESTA BACK:", text)

  let data = {}

  try {
    data = text ? JSON.parse(text) : {}
  } catch (e) {
    throw new Error("El servidor no devolvió JSON válido")
  }

  if (!response.ok) {
    throw new Error(data.error || data.message || "Error API")
  }

  if (options.responseType === "blob") {
    return response
  }

  return data
}