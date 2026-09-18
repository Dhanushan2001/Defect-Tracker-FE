import apiClient from "../../lib/api";
import { ENDPOINTS } from "../../utils/apiendpoint";
import { CreateModuleRequest, CreateModuleResponse } from "../../types/index";

export const createModule = async (data: CreateModuleRequest): Promise<CreateModuleResponse> => {
  const response = await apiClient.post(ENDPOINTS.module(data.projectId), {
    name: data.name,
    moduleName: data.name,
    projectId: data.projectId,
  });

  const resData = response.data?.data || response.data;
  return {
    status: "Created",
    statusCode: "200",
    message: response.data?.message || "Module created successfully",
    data: Array.isArray(resData) ? resData : [resData],
  };
};

export const createSubmodule = async (data: { subModuleName: string; moduleId: number; projectId?: number }) => {
  const response = await apiClient.post(ENDPOINTS.subModule(data.moduleId), {
    name: data.subModuleName,
    subModuleName: data.subModuleName,
    moduleId: data.moduleId,
    projectId: data.projectId,
  });

  const resData = response.data?.data || response.data;
  return {
    status: "success",
    message: response.data?.message || "Submodule created successfully",
    data: resData,
  };
};
