import apiClient from "../../lib/api";
import { ENDPOINTS } from "../../utils/apiendpoint";

export async function deleteReleaseById(id: number) {
  const response = await apiClient.delete(ENDPOINTS.releaseById(id));
  return response.data;
}

export const deleteRelease = deleteReleaseById;