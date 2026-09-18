import apiClient from "../../lib/api";
import { ENDPOINTS } from "../../utils/apiendpoint";

export const deleteModule = async (projectId: number, id: number): Promise<{ status: string; statusCode?: string; data?: any[]; message?: string }> => {
  const response = await apiClient.delete(ENDPOINTS.moduleById(projectId, id));
  return {
    status: "success",
    statusCode: "200",
    message: response.data?.message || "Module deleted successfully",
  };
};
