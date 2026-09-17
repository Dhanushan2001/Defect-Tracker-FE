import apiClient from "../../lib/api";
import { ENDPOINTS } from "../../utils/apiendpoint";

export const deleterole = async (id: number) => {
  const response = await apiClient.delete(ENDPOINTS.roleById(id));
  return response.data;
};

