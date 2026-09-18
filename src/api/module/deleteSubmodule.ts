import apiClient from "../../lib/api";
import { ENDPOINTS } from "../../utils/apiendpoint";

export const deleteSubmodule = async (submoduleId: number, moduleId: number) => {
  const response = await apiClient.delete(ENDPOINTS.subModuleById(moduleId, submoduleId));
  return {
    status: "success",
    message: response.data?.message || "Submodule deleted successfully",
    data: { submoduleId, moduleId },
  };
};