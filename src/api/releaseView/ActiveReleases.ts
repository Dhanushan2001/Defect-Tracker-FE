import apiClient from "../../lib/api";

export interface ActiveRelease {
  id: string;
  releaseId: string;
  name: string;
  description: string;
  status: string;
  releaseDate: string;
  releaseType_id: string;
  project_id: number;
}

export interface ActiveReleasesResponse {
  message: string;
  data: ActiveRelease[];
  status: string;
  statusCode: string;
}

export const getActiveReleases = async (projectId: string | number): Promise<ActiveReleasesResponse> => {
  try {
    const response = await apiClient.get(`/api/v1/project/${projectId}/release/active`);
    const list = response.data?.data || response.data || [];
    const releases = Array.isArray(list) ? list : [];
    releases.sort((a: any, b: any) => Number(a.id) - Number(b.id));

    return {
      message: 'Success',
      status: 'success',
      statusCode: '200',
      data: releases.map((r: any) => ({
        id: String(r.id),
        releaseId: String(r.id),
        name: r.name || r.releaseName || 'Release',
        description: r.description || '',
        status: r.status || 'In Progress',
        releaseDate: r.releaseDate || '',
        releaseType_id: String(r.releaseTypeId || r.releaseType_id || (r.releaseType ? r.releaseType.id : 1)),
        project_id: Number(projectId),
      })),
    };
  } catch (error) {
    return {
      message: 'Error',
      status: 'error',
      statusCode: '500',
      data: [],
    };
  }
};