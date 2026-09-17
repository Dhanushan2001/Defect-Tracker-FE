import apiClient from "../lib/api";
import { ENDPOINTS } from "../utils/apiendpoint";

export interface DefectStatus {
  id: number;
  name: string;
  statusName?: string;
  defectStatusName?: string;
  color: string;
  colorCode?: string;
  type?: string;
  statusType?: string;
  description?: string;
}

export interface DefectStatusData {
  content: DefectStatus[];
  totalPages: number;
  totalElements?: number;
  pageNumber?: number;
  pageSize?: number;
}

export interface DefectStatusResponse {
  status: string;
  statusMessage: string;
  data: DefectStatusData;
  statusCode: number;
}

export interface CreateDefectStatusRequest {
  name: string;
  color: string;
  type: string;
  description?: string;
}

export interface UpdateDefectStatusRequest {
  name: string;
  color: string;
  type: string;
  description?: string;
}

export const getAllDefectStatuses = async (
  page?: number,
  pageSize?: number
): Promise<any> => {
  const url = (page !== undefined && pageSize !== undefined)
    ? ENDPOINTS.statusTypePagination(page, pageSize)
    : ENDPOINTS.statusType;
  const response = await apiClient.get(url);
  const data = response.data;
  
  if (data && data.data && Array.isArray(data.data)) {
    const list: DefectStatus[] = data.data.map((s: any) => ({
      ...s,
      id: s.id,
      name: s.name || s.statusName,
      statusName: s.statusName || s.name,
      defectStatusName: s.name || s.statusName,
      color: s.color || s.colorCode,
      colorCode: s.color || s.colorCode,
      type: s.type || s.statusType,
      statusType: s.type || s.statusType,
    }));
    return {
      status: 'success',
      statusMessage: data.statusMessage || data.message || 'Success',
      statusCode: data.statusCode || 200,
      content: list,
      totalPages: 1,
      totalElements: list.length,
      data: list,
    };
  } else if (data && data.data && Array.isArray(data.data.content)) {
    const list: DefectStatus[] = data.data.content.map((s: any) => ({
      ...s,
      id: s.id,
      name: s.name || s.statusName,
      statusName: s.statusName || s.name,
      defectStatusName: s.name || s.statusName,
      color: s.color || s.colorCode,
      colorCode: s.color || s.colorCode,
      type: s.type || s.statusType,
      statusType: s.type || s.statusType,
    }));
    return {
      status: 'success',
      statusMessage: data.statusMessage || data.message || 'Success',
      statusCode: data.statusCode || 200,
      content: list,
      totalPages: data.data.totalPages,
      totalElements: data.data.totalElements,
      data: {
        content: list,
        totalPages: data.data.totalPages,
        totalElements: data.data.totalElements,
      },
    };
  }
  return data;
};

export const createDefectStatus = async (
  statusData: CreateDefectStatusRequest
): Promise<DefectStatusResponse> => {
  const response = await apiClient.post(ENDPOINTS.statusType, statusData);
  const data = response.data;
  const item = data.data;
  return {
    status: data.status || 'success',
    statusMessage: data.statusMessage || data.message || 'Status created successfully',
    statusCode: data.statusCode || 201,
    data: {
      content: item ? [item] : [],
      totalPages: 1,
    },
  };
};

export const updateDefectStatus = async (
  id: number,
  statusData: UpdateDefectStatusRequest
): Promise<DefectStatusResponse> => {
  const response = await apiClient.put(ENDPOINTS.statusTypeById(id), statusData);
  const data = response.data;
  const item = data.data;
  return {
    status: data.status || 'success',
    statusMessage: data.statusMessage || data.message || 'Status updated successfully',
    statusCode: data.statusCode || 200,
    data: {
      content: item ? [item] : [],
      totalPages: 1,
    },
  };
};

export const deleteDefectStatus = async (id: number): Promise<DefectStatusResponse> => {
  const response = await apiClient.delete(ENDPOINTS.statusTypeById(id));
  const data = response.data;
  return {
    status: data.status || 'success',
    statusMessage: data.statusMessage || data.message || 'Status deleted successfully',
    statusCode: data.statusCode || 200,
    data: {
      content: [],
      totalPages: 1,
    },
  };
};
