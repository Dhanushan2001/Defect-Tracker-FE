import apiClient from "../../lib/api";

export const createRoles = async (data: { name: string; type?: string; description?: string }) => {
  const response = await apiClient.post("/api/v1/role", data);
  return response.data;
};