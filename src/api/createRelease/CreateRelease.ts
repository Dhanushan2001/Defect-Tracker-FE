import apiClient from "../../lib/api";

export interface CreateReleaseRequest {
  name: string;
  releaseDate: string;
  releaseType_name?: string;
  releaseTypeId?: number;
  releaseType_id?: number | string;
  project_id: number;
  status?: string;
  description?: string;
  version?: string;
}

export interface CreateReleaseResponse {
  status: string;
  message: string;
  data: any;
  statusCode: number;
}

export const createRelease = async (payload: CreateReleaseRequest): Promise<any> => {
  const effectiveReleaseTypeId = payload.releaseTypeId || (payload.releaseType_id ? Number(payload.releaseType_id) : undefined);
  const body = {
    name: payload.name,
    releaseName: payload.name,
    version: payload.version || '',
    releaseDate: payload.releaseDate,
    releaseTypeId: effectiveReleaseTypeId,
    releaseType_id: effectiveReleaseTypeId,
    releaseTypeName: payload.releaseType_name,
    projectId: payload.project_id,
    project_id: payload.project_id,
    status: payload.status || 'In Progress',
    description: payload.description || '',
  };

  const response = await apiClient.post(`/api/v1/project/${payload.project_id}/release`, body);
  return response.data;
};
