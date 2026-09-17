import apiClient from "../../lib/api";
import { ENDPOINTS } from "../../utils/apiendpoint";

export interface Role {
  id: number;
  name: string;
  roleName?: string;
  type?: string;
  roleType?: string;
  description?: string;
}

export interface GetRolesResponse {
  status: string;
  message: string;
  statusMessage?: string;
  data: {
    content: Role[];
    totalElements: number;
    totalPages: number;
    pageNumber: number;
    pageSize: number;
  };
}

export const getAllRoles = async (page?: number, pageSize?: number): Promise<GetRolesResponse> => {
  const url = (page !== undefined && pageSize !== undefined)
    ? ENDPOINTS.role(page, pageSize)
    : '/api/v1/role';
  const response = await apiClient.get(url);
  const data = response.data;
  if (data && data.data && Array.isArray(data.data)) {
    return {
      ...data,
      data: {
        content: data.data,
        totalElements: data.data.length,
        totalPages: 1,
        pageNumber: 0,
        pageSize: data.data.length,
      }
    };
  }
  return data;
};

