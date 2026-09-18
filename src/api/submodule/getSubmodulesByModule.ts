import apiClient from "../../lib/api";
import { ENDPOINTS } from "../../utils/apiendpoint";

export const getSubmodulesByModule = async (moduleId: number) => {
  try {
    const response = await apiClient.get(ENDPOINTS.subModule(Number(moduleId)));
    const resData = response.data?.data || response.data || [];
    const list = Array.isArray(resData) ? resData : Array.isArray(resData?.content) ? resData.content : [];

    return {
      status: "success",
      statusCode: 200,
      data: list.map((s: any) => ({
        id: s.id,
        name: s.name || s.subModuleName || "Submodule",
        subModuleName: s.subModuleName || s.name || "Submodule",
        submoduleName: s.subModuleName || s.name || "Submodule",
        getSubModuleName: s.subModuleName || s.name || "Submodule",
        moduleId: s.moduleId || Number(moduleId),
        projectId: s.projectId,
        description: s.description || "",
      })),
    };
  } catch (error: any) {
    console.error("Failed to fetch submodules by module id:", error);
    return {
      status: "error",
      statusCode: 500,
      data: [],
    };
  }
};

export const getSubmodulesByModuleId = getSubmodulesByModule;
