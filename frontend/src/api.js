// Small fetch helper around the backend API.

const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(
  /\/+$/,
  ""
);

export async function apiRequest(path, options = {}) {
  const { method = "GET", body } = options;
  const res = await fetch(BASE_URL + path, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    // empty body
  }
  if (!res.ok) {
    const message =
      data?.detail?.[0]?.message ||
      (typeof data?.detail === "string" && data.detail) ||
      `Request failed (status ${res.status}).`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}
