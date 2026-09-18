import apiClient from "../../lib/api";
import { ENDPOINTS } from "../../utils/apiendpoint";

export interface getProjectAllocationHistoryResponse {
  status: string;
  message: string;
  data: any[];
  statusCode: number;
}

export const getProjectAllocationHistory = async (id: number): Promise<any> => {
  try {
    const response = await apiClient.get(ENDPOINTS.projectAllocationProjectEmployeeHistory(id));
    return response.data;
  } catch (error) {
    console.error("Error fetching project allocation history:", error);
    return {
      status: "error",
      statusCode: 500,
      message: "Failed to fetch allocation history",
      data: [],
    };
  }
};

export const getProjectAllocationHistoryByRole = async (projectId: number, _roleId?: string): Promise<any> => {
  return getProjectAllocationHistory(projectId);
};
