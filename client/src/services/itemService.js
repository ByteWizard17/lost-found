import api from "./api";

export const getItems = async () => {
  const response = await api.get("/items");
  return response.data;
};

export const addItem = async (item) => {
  const response = await api.post("/items", item);
  return response.data;
};

export const getItemById = async (id) => {
  const response = await api.get(`/items/${id}`);
  return response.data;
};

export const searchItems = async (keyword = "", category = "", type = "", dateFrom = "", dateTo = "") => {
  const params = new URLSearchParams();
  if (keyword) params.append("keyword", keyword);
  if (category) params.append("category", category);
  if (type) params.append("type", type);
  if (dateFrom) params.append("dateFrom", dateFrom);
  if (dateTo) params.append("dateTo", dateTo);

  const response = await api.get(`/items/search?${params.toString()}`);
  return response.data;
};

export const claimItem = async (itemId, message) => {
  const response = await api.post(`/items/${itemId}/claim`, { message });
  return response.data;
};

export const approveClaim = async (itemId, claimIndex) => {
  const response = await api.patch(`/items/${itemId}/claim/${claimIndex}/approve`);
  return response.data;
};

export const rejectClaim = async (itemId, claimIndex) => {
  const response = await api.patch(`/items/${itemId}/claim/${claimIndex}/reject`);
  return response.data;
};

export const reportItem = async (itemId, reason) => {
  const response = await api.post(`/items/${itemId}/report`, { reason });
  return response.data;
};

// Admin functions
export const getPendingItems = async () => {
  const response = await api.get("/items/admin/pending");
  return response.data;
};

export const approveItem = async (itemId) => {
  const response = await api.patch(`/items/admin/${itemId}/approve`);
  return response.data;
};

export const rejectItem = async (itemId, reason) => {
  const response = await api.patch(`/items/admin/${itemId}/reject`, { reason });
  return response.data;
};

export const getAdminStats = async () => {
  const response = await api.get("/items/admin/stats");
  return response.data;
};

