import api from "./api";

export const adminService = {
  getAllItems: async () => {
    const response = await api.get("/items/admin/all");
    return response.data;
  },

  getPendingItems: async () => {
    const response = await api.get("/items/admin/pending");
    return response.data;
  },

  approveItem: async (itemId) => {
    const response = await api.patch(`/items/admin/${itemId}/approve`);
    return response.data;
  },

  rejectItem: async (itemId, reason) => {
    const response = await api.patch(`/items/admin/${itemId}/reject`, { reason });
    return response.data;
  },

  deleteItem: async (itemId, reason) => {
    const response = await api.delete(`/items/admin/${itemId}`, {
      data: { reason },
    });
    return response.data;
  },

  getAdminStats: async () => {
    const response = await api.get("/items/admin/stats");
    return response.data;
  },

  getAllUsers: async () => {
    const response = await api.get("/users/admin/all");
    return response.data;
  },

  getUserDetails: async (userId) => {
    const response = await api.get(`/users/admin/${userId}`);
    return response.data;
  },

  blockUser: async (userId, reason) => {
    const response = await api.post(`/users/admin/${userId}/block`, { reason });
    return response.data;
  },

  unblockUser: async (userId) => {
    const response = await api.post(`/users/admin/${userId}/unblock`, {});
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await api.delete(`/users/admin/${userId}`);
    return response.data;
  },

  getReports: async (status = null) => {
    const params = status ? { status } : {};
    const response = await api.get("/reports", { params });
    return response.data;
  },

  resolveReport: async (reportId, action, deleteReason = null) => {
    const response = await api.patch(`/reports/${reportId}/resolve`, {
      action,
      deleteReason,
    });
    return response.data;
  },

  getReportStats: async () => {
    const response = await api.get("/reports/stats");
    return response.data;
  },

  reportItem: async (itemId, reason, description) => {
    const response = await api.post("/reports", {
      itemId,
      reason,
      description,
    });
    return response.data;
  },
};
