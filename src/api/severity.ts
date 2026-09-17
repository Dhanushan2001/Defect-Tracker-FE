import apiClient from "../lib/api";
import { ENDPOINTS } from "../utils/apiendpoint";

export interface Severity {
  id: number;
  name: string;
  severityName?: string;
  color: string;
  weight: number;
  description?: string;
}

export interface CreateSeverityRequest {
  name: string;
  severityName?: string;
  color: string;
  weight: number;
  description?: string;
}

export interface CreateSeverityResponse {
  status: string;
  message: string;
  statusMessage?: string;
  statusCode: number;
  data?: Severity;
}

export interface GetSeveritiesResponse {
  status: string;
  message: string;
  statusMessage?: string;
  data: {
    content: Severity[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  };
}

export const createSeverity = async (data: CreateSeverityRequest): Promise<CreateSeverityResponse> => {
  const response = await apiClient.post(ENDPOINTS.severity, data);
  return response.data;
};

export const updateSeverity = async (id: number, data: Partial<CreateSeverityRequest>): Promise<CreateSeverityResponse> => {
  const response = await apiClient.put(ENDPOINTS.severityById(id), data);
  return response.data;
};

export const getSeverities = async (
  page?: number,
  pageSize?: number
): Promise<GetSeveritiesResponse> => {
  const url = (page !== undefined && pageSize !== undefined)
    ? ENDPOINTS.severityPagination(page, pageSize)
    : ENDPOINTS.severity;
  const response = await apiClient.get(url);
  const data = response.data;
  if (data && data.data && Array.isArray(data.data)) {
    return {
      ...data,
      data: {
        content: data.data,
        totalElements: data.data.length,
        totalPages: 1,
        size: data.data.length,
        number: 0,
      }
    };
  }
  return data;
};

export const deleteSeverity = async (id: number) => {
  const response = await apiClient.delete(ENDPOINTS.severityById(id));
  return response.data;
};

