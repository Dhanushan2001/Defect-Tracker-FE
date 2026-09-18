import apiClient from "../../lib/api";
import { ENDPOINTS } from "../../utils/apiendpoint";

export const updateSubmodule = async (
  submoduleId: number,
  moduleId: number,
  data: { subModuleName: string }
) => {
  const response = await apiClient.put(ENDPOINTS.subModuleById(moduleId, submoduleId), {
    name: data.subModuleName,
    subModuleName: data.subModuleName,
    moduleId: moduleId,
  });

  const resData = response.data?.data || response.data;
  return {
    status: "success",
    success: true,
    message: response.data?.message || "Submodule updated successfully",
    data: resData,
  };
};