import apiClient from "../../lib/api";
import { ENDPOINTS } from "../../utils/apiendpoint";
import { Module } from "../../types/index";

export const updateModule = async (
  projectId: number,
  id: number,
  data: Partial<Module>
): Promise<{ success: boolean; module?: Module; message?: string }> => {
  const response = await apiClient.put(ENDPOINTS.moduleById(projectId, id), {
    name: data.name,
    projectId: projectId,
  });

  const resData = response.data?.data || response.data;
  return {
    success: true,
    module: resData as any,
    message: response.data?.message || "Module updated successfully",
  };
};
