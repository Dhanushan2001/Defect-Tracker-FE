import apiClient from "../../lib/api";
import { ENDPOINTS } from "../../utils/apiendpoint";

export async function createUser(userData: any) {
  const response = await apiClient.post(ENDPOINTS.employee, userData);
  return response.data;
}