import apiClient from "../lib/api";
import { ENDPOINTS } from "../utils/apiendpoint";

export interface Priority {
  id: number;
  name: string;
  priorityName?: string;
  color: string;
  weight?: number;
  description?: string;
}

export interface GetPrioritiesResponse {
  status: string;
  message: string;
  statusMessage?: string;
  statusCode?: number;
  data: {
    content: Priority[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  };
}

export const getAllPriorities = async (
  page?: number,
  size?: number
): Promise<GetPrioritiesResponse> => {
  const url = (page !== undefined && size !== undefined)
    ? ENDPOINTS.priorityPagination(page, size)
    : ENDPOINTS.priority;
  const response = await apiClient.get(url);
  const data = response.data;
  if (data && data.data && Array.isArray(data.data)) {
    return {
      ...data,
      data: {
        content: data.data.map((item: any) => ({
          ...item,
          name: item.name || item.priorityName,
          priorityName: item.priorityName || item.name,
        })),
        totalElements: data.data.length,
        totalPages: 1,
        size: data.data.length,
        number: 0,
      },
    };
  } else if (data && data.data && Array.isArray(data.data.content)) {
    return {
      ...data,
      data: {
        ...data.data,
        content: data.data.content.map((item: any) => ({
          ...item,
          name: item.name || item.priorityName,
          priorityName: item.priorityName || item.name,
        })),
      },
    };
  }
  return data;
};

export const createPriority = async (data: { name: string; color: string; weight?: number; description?: string }) => {
  const response = await apiClient.post(ENDPOINTS.priority, data);
  return response.data;
};

export const updatePriority = async (id: number, data: { name: string; color: string; weight?: number; description?: string }) => {
  const response = await apiClient.put(ENDPOINTS.priorityById(id), data);
  return response.data;
};

export const deletePriority = async (id: number) => {
  const response = await apiClient.delete(ENDPOINTS.priorityById(id));
  return response.data;
};