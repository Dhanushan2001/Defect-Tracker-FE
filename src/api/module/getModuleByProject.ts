import apiClient from "../../lib/api";
import { ENDPOINTS } from "../../utils/apiendpoint";

export interface Modules {
  id: number;
  name: string;
  moduleName?: string;
  projectId: number;
  submodules?: any[];
  assignedDevs?: string[];
}

export interface CreateReleaseResponse {
  status: string;
  message: string;
  data: Modules[];
  statusCode: number;
}

export const getModulesByProject = async (projectId: number): Promise<CreateReleaseResponse> => {
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
        moduleName: m.moduleName || m.name || "Module",
        projectId: m.projectId || Number(projectId),
        submodules: m.submodules || [],
        assignedDevs: m.assignedDevs || [],
      })),
    };
  } catch (error: any) {
    console.error("Failed to get modules by project id:", error);
    return {
      status: "error",
      message: error?.response?.data?.message || "Failed to fetch modules",
      statusCode: error?.response?.status || 500,
      data: [],
    };
  }
};