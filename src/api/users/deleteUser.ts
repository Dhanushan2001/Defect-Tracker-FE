import apiClient from "../../lib/api";
import { ENDPOINTS } from "../../utils/apiendpoint";

export async function deleteUser(id: number) {
  const response = await apiClient.delete(ENDPOINTS.employeeById(id));
  return response.data;
}