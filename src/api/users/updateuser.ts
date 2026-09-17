import apiClient from "../../lib/api";
import { ENDPOINTS } from "../../utils/apiendpoint";

export interface UpdateUserPayload {
  id?: number;
  userId?: number;
  firstName: string;
  lastName: string;
  email: string;
  contactNo?: string;
  joinDate?: string;
  gender?: "Male" | "Female" | string;
  designationId?: number;
}

export async function updateUser(id: number, userData: UpdateUserPayload) {
  const response = await apiClient.put(ENDPOINTS.employeeById(id), userData);
  return response.data;
}

export async function updateUserStatus(id: number, status: boolean) {
  const response = await apiClient.put(ENDPOINTS.employeeStatus(id), { status });
  return response.data;
}
