import apiClient from "../lib/api";
import { ENDPOINTS } from "../utils/apiendpoint";

export interface Releasetype {
  id: number;
  name: string;
  releaseTypeName: string;
  description?: string;
}

export interface ReleaseTypeList {
  totalElements: number;
  totalPages?: number;
  content: Releasetype[];
}

export interface ReleaseTypeResponse {
  status: string;
  statusMessage?: string;
  data: ReleaseTypeList;
  statusCode: number;
}

export interface CreateReleaseTypeRequest {
  releaseTypeName?: string;
  name?: string;
  description?: string;
}

export interface UpdateReleaseTypeRequest {
  releaseTypeName?: string;
  name?: string;
  description?: string;
}

export const getAllReleaseTypes = async (page?: number, size?: number): Promise<ReleaseTypeResponse> => {
  const url = (page !== undefined && size !== undefined)
    ? ENDPOINTS.releaseTypePagination(page, size)
    : ENDPOINTS.releaseType;
  const response = await apiClient.get(url);
  const data = response.data;
  if (data && data.data && Array.isArray(data.data)) {
    return {
      ...data,
      data: {
        totalElements: data.data.length,
        totalPages: 1,
        content: data.data.map((item: any) => ({
          id: item.id,
          name: item.name || item.releaseTypeName,
          releaseTypeName: item.releaseTypeName || item.name,
          description: item.description,
        })),
      },
    };
  } else if (data && data.data && Array.isArray(data.data.content)) {
    return {
      ...data,
      data: {
        ...data.data,
        content: data.data.content.map((item: any) => ({
          id: item.id,
          name: item.name || item.releaseTypeName,
          releaseTypeName: item.releaseTypeName || item.name,
          description: item.description,
        })),
      },
    };
  }
  return data;
};

export const createReleaseType = async (data: CreateReleaseTypeRequest): Promise<any> => {
  const response = await apiClient.post(ENDPOINTS.releaseType, data);
  return response.data;
};

export const updateReleaseType = async (id: number, data: UpdateReleaseTypeRequest): Promise<any> => {
  const response = await apiClient.put(ENDPOINTS.releaseTypeById(id), data);
  return response.data;
};

export const deleteReleaseType = async (id: number): Promise<any> => {
  const response = await apiClient.delete(ENDPOINTS.releaseTypeById(id));
  return response.data;
};