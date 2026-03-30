import api from "./api";

export const getUserProfile = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

export const getMyProfile = async () => {
  const response = await api.get("/users/profile/me");
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.put("/users/profile/update", profileData);
  return response.data;
};

export const getMyItems = async () => {
  const response = await api.get("/users/items/my-items");
  return response.data;
};

export const getMyClaimsOnItems = async () => {
  const response = await api.get("/users/claims/my-claims");
  return response.data;
};

export const getReceivedClaims = async () => {
  const response = await api.get("/users/claims/received");
  return response.data;
};

export const getAllUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};
