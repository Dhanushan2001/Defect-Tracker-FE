import apiClient from "../lib/api";
import { ENDPOINTS } from "../utils/apiendpoint";

export interface ApiDefectType {
  id: number;
  name: string;
  defectTypeName: string;
  description?: string;
  category?: string;
  severity?: string;
  priority?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetDefectTypesResponse {
  status: string;
  message: string;
  statusMessage?: string;
  statusCode?: number;
  data: {
    content: ApiDefectType[];
    totalElements: number;
    totalPages: number;
    pageNumber: number;
    pageSize: number;
  };
}

export const getDefectTypes = async (page?: number, size?: number): Promise<GetDefectTypesResponse> => {
  const url = (page !== undefined && size !== undefined)
    ? `${ENDPOINTS.defectType}?page=${page}&size=${size}&sort=id&direction=ASC`
    : ENDPOINTS.defectType;
  const response = await apiClient.get(url);
  const data = response.data;
  if (data && data.data && Array.isArray(data.data)) {
    return {
      ...data,
      data: {
        content: data.data.map((item: any) => ({
          ...item,
          name: item.name || item.defectTypeName,
          defectTypeName: item.defectTypeName || item.name,
        })),
        totalElements: data.data.length,
        totalPages: 1,
        pageNumber: 0,
        pageSize: data.data.length,
      },
    };
  }
  return data;
};

export const createDefectType = async (data: { name: string; description?: string }) => {
  const response = await apiClient.post(ENDPOINTS.defectType, data);
  return response.data;
};

export const updateDefectType = async (id: number, data: { name: string; description?: string }) => {
  const response = await apiClient.put(ENDPOINTS.defectTypeById(id), data);
  return response.data;
};

export const deleteDefectType = async (id: number) => {
  const response = await apiClient.delete(ENDPOINTS.defectTypeById(id));
  return response.data;
};