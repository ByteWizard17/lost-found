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
