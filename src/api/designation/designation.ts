import apiClient from "../../lib/api";
import { ENDPOINTS } from "../../utils/apiendpoint";

export interface Designations {
  id: number;
  name: string;
  designationName?: string;
  description?: string;
}

export interface CreateDesignations {
  name: string;
  description?: string;
}

export async function getDesignations(page?: number, size?: number) {
  const url = (page !== undefined && size !== undefined)
    ? ENDPOINTS.designationPagination(page, size)
    : ENDPOINTS.designation;
  const response = await apiClient.get(url);
  return response.data;
}

export const getAllDesignations = getDesignations;

export async function createDesignation(data: CreateDesignations) {
  const response = await apiClient.post(ENDPOINTS.designation, data);
  return response.data;
}

export async function putDesignation(id: number, data: CreateDesignations) {
  const response = await apiClient.put(ENDPOINTS.designationById(id), data);
  return response.data;
}

export const updateDesignation = putDesignation;

export async function deleteDesignation(id: number) {
  const response = await apiClient.delete(ENDPOINTS.designationById(id));
  return response.data;
}
