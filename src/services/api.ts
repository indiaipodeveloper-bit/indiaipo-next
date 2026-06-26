import { API_URL } from "@/lib/constants";

const getApiBaseUrl = () => {
  return `${API_URL}/api`;
};

const API_BASE_URL = getApiBaseUrl();

const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

const headers = (json = true) => {
  const h: Record<string, string> = {};
  if (json) h["Content-Type"] = "application/json";
  const token = getToken();
  if (token) h["Authorization"] = `Bearer ${token}`;
  return h;
};

const handleResponse = async (res: Response) => {
  const data = await res.json();
  if (!res.ok) {
    const errorMsg = data.error || data.message || "Request failed";
    throw new Error(errorMsg);
  }
  return data;
};

export const ipoListApi = {
  getAll: (params?: Record<string, string>) => {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return fetch(`${API_BASE_URL}/ipo-lists${query}`, { headers: headers() }).then(handleResponse);
  },
  getById: (id: string) =>
    fetch(`${API_BASE_URL}/ipo-lists/${id}`, { headers: headers() }).then(handleResponse),
  create: (data: Record<string, unknown>) =>
    fetch(`${API_BASE_URL}/ipo-lists`, { method: "POST", headers: headers(), body: JSON.stringify(data) }).then(handleResponse),
  update: (id: string, data: Record<string, unknown>) =>
    fetch(`${API_BASE_URL}/ipo-lists/${id}`, { method: "PUT", headers: headers(), body: JSON.stringify(data) }).then(handleResponse),
  delete: (id: string) =>
    fetch(`${API_BASE_URL}/ipo-lists/${id}`, { method: "DELETE", headers: headers() }).then(handleResponse),
  getSectors: () =>
    fetch(`${API_BASE_URL}/ipo-lists/sectors/list`, { headers: headers() }).then(handleResponse),
};

export const sectorApi = {
  getAll: (params?: Record<string, string>) => {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return fetch(`${API_BASE_URL}/sectors${query}`, { headers: headers() }).then(handleResponse);
  },
  getAdminAll: (params?: Record<string, string | number>) => {
    const query = params ? "?" + new URLSearchParams(params as Record<string, string>).toString() : "";
    return fetch(`${API_BASE_URL}/sectors/admin${query}`, { headers: headers() }).then(handleResponse);
  },
  create: (data: any) => fetch(`${API_BASE_URL}/sectors`, { method: "POST", headers: headers(), body: JSON.stringify(data) }).then(handleResponse),
  update: (id: string, data: any) => fetch(`${API_BASE_URL}/sectors/${id}`, { method: "PUT", headers: headers(), body: JSON.stringify(data) }).then(handleResponse),
  delete: (id: string) => fetch(`${API_BASE_URL}/sectors/${id}`, { method: "DELETE", headers: headers() }).then(handleResponse),
};

export const sectorIpoApi = {
  getAll: (params?: Record<string, any>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return fetch(`${API_BASE_URL}/sectors/ipos/list${query}`, { headers: headers() }).then(handleResponse);
  },
  getById: (id: string) => fetch(`${API_BASE_URL}/sectors/ipos/${id}`, { headers: headers() }).then(handleResponse),
  create: (data: any) => fetch(`${API_BASE_URL}/sectors/ipos/create`, { method: "POST", headers: headers(), body: JSON.stringify(data) }).then(handleResponse),
  update: (id: string, data: any) => fetch(`${API_BASE_URL}/sectors/ipos/${id}`, { method: "PUT", headers: headers(), body: JSON.stringify(data) }).then(handleResponse),
  delete: (id: string) => fetch(`${API_BASE_URL}/sectors/ipos/${id}`, { method: "DELETE", headers: headers() }).then(handleResponse),
};

export const adminBlogApi = {
  getSummaryList: () => fetch(`${API_BASE_URL}/admin-blogs?limit=1000&summary=true`, { headers: headers() }).then(handleResponse),
};
