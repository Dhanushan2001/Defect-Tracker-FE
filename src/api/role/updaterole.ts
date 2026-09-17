import apiClient from "../../lib/api";
import { ENDPOINTS } from "../../utils/apiendpoint";

export const updateRole = async (id: number, data: { name: string; type?: string; description?: string }) => {
  const response = await apiClient.put(ENDPOINTS.roleById(id), data);
  return response.data;
};