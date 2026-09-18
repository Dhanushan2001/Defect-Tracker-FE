import apiClient from "../../lib/api";
import { ENDPOINTS } from "../../utils/apiendpoint";

export interface Modules {
  id: number;
  name: string;
  projectId: number;
  assignedDev: {
    userId: number;
    userName: string;
  } | null;
  submodules?: any[];
}

export interface CreateReleaseResponse {
  status: string;
  message: string;
  data: Modules[];
  statusCode: number;
}

export const getModulesByProjectId = async (projectId: number): Promise<CreateReleaseResponse> => {
  try {
    const response = await apiClient.get(ENDPOINTS.module(Number(projectId)));
    const resData = response.data?.data || response.data || [];
    const list = Array.isArray(resData) ? resData : Array.isArray(resData?.content) ? resData.content : [];

    return {
      status: "success",
      message: "Modules fetched successfully",
      statusCode: 200,
      data: list.map((m: any) => ({
        id: m.id,
        name: m.name || m.moduleName || "Module",
        projectId: m.projectId || Number(projectId),
        assignedDev: m.assignedDev || null,
        submodules: m.submodules || [],
      })),
    };
  } catch (error: any) {
    console.error("Failed to get modules by project id:", error);
    return {
      status: "error",
      message: error.response?.data?.message || "Failed to fetch modules",
      statusCode: 500,
      data: [],
    };
  }
};

export async function getAllocatedUsersByModuleId(_moduleId: string | number) {
  return [];
}

export async function getUsersByAllocation(_projectId: string | number, _moduleId: string | number, _subModuleId?: string | number) {
  return [];
}
