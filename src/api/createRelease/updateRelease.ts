import apiClient from "../../lib/api";
import { ENDPOINTS } from "../../utils/apiendpoint";

export async function updateRelease(id: number, data: any) {
  const effectiveReleaseTypeId = data.releaseTypeId || (data.releaseType_id ? Number(data.releaseType_id) : undefined);
  const body = {
    name: data.name,
    releaseName: data.name,
    version: data.version || '',
    releaseDate: data.releaseDate,
    releaseTypeId: effectiveReleaseTypeId,
    releaseType_id: effectiveReleaseTypeId,
    projectId: data.project_id || data.projectId,
    project_id: data.project_id || data.projectId,
    status: data.status,
    description: data.description,
  };
  const response = await apiClient.put(ENDPOINTS.releaseById(id), body);
  return response.data;
}
