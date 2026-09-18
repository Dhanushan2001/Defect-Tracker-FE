import apiClient from "../../lib/api";
import { ENDPOINTS } from "../../utils/apiendpoint";

export interface Submodule {
  id: number;
  name: string;
  submoduleName?: string;
  subModuleName?: string;
  getSubModuleName?: string;
  moduleId?: number;
  projectId?: number;
}

export interface GetSubmodulesResponse {
  status: string;
  message: string;
  data: Submodule[];
  statusCode: number;
}

export const getSubmodulesByModule = async (moduleId: number): Promise<GetSubmodulesResponse> => {
  try {
    const response = await apiClient.get(ENDPOINTS.subModule(Number(moduleId)));
    const resData = response.data?.data || response.data || [];
    const list = Array.isArray(resData) ? resData : Array.isArray(resData?.content) ? resData.content : [];

    return {
      status: "success",
      message: "Submodules fetched successfully",
      statusCode: 200,
      data: list.map((s: any) => ({
        id: s.id,
        name: s.name || s.subModuleName || "Submodule",
        submoduleName: s.subModuleName || s.name || "Submodule",
        subModuleName: s.subModuleName || s.name || "Submodule",
        getSubModuleName: s.subModuleName || s.name || "Submodule",
        moduleId: s.moduleId || Number(moduleId),
        projectId: s.projectId,
      })),
    };
  } catch (error: any) {
    console.error("Failed to fetch submodules in submoduleget:", error);
    return {
      status: "error",
      message: error.response?.data?.message || "Failed to fetch submodules",
      statusCode: 500,
      data: [],
    };
  }
};

export const getSubmodulesByModuleId = async (moduleId: number): Promise<GetSubmodulesResponse> => {
  return getSubmodulesByModule(moduleId);
};
