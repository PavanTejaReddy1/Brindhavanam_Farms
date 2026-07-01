// API helper functions for authenticated requests

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");
  const adminToken = localStorage.getItem("adminToken");
  const authToken = adminToken || token;

  const headers = {
    "Content-Type": "application/json",
    ...(authToken && { Authorization: `Bearer ${authToken}` }),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Request failed");
  }

  return response.json();
}

export async function fetchWithAdminAuth(url: string, options: RequestInit = {}) {
  const adminToken = localStorage.getItem("adminToken");

  if (!adminToken) {
    throw new Error("Admin not authenticated");
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${adminToken}`,
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Request failed");
  }

  return response.json();
}
