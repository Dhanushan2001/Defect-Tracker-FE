import apiClient from "../../lib/api";

export interface ProjectRelease {
  id: string;
  releaseId: string;
  releaseName: string;
  name: string;
  version?: string;
  description: string;
  status: string;
  releaseDate: string;
  releaseType_name: string;
  releaseType_id?: string | number;
  releaseTypeId?: number;
  project_id: number;
}

export const projectReleaseCardView = async (projectId: string | number) => {
  try {
    const response = await apiClient.get(`/api/v1/project/${projectId}/release`);
    const rawList = response.data?.data || response.data || [];
    const releases = Array.isArray(rawList) ? rawList : [];
    releases.sort((a: any, b: any) => Number(a.id) - Number(b.id));

    return {
      status: 'success',
      statusCode: '200',
      message: 'Success',
      data: releases.map((r: any) => ({
        ...r,
        id: String(r.id),
        releaseId: String(r.id),
        releaseName: r.name || r.releaseName || '',
        name: r.name || r.releaseName || '',
        version: r.version || '',
        description: r.description || '',
        status: r.status || 'In Progress',
        releaseDate: r.releaseDate || '',
        releaseType_name: r.releaseTypeName || r.releaseType_name || r.releaseType?.name || r.releaseType?.releaseTypeName || 'Major Release',
        releaseType_id: r.releaseTypeId || r.releaseType_id || r.releaseType?.id || '',
        releaseTypeId: r.releaseTypeId || r.releaseType_id || r.releaseType?.id || undefined,
        testCaseCount: r.testCaseCount ?? r.test_case_count ?? 0,
        project_id: Number(projectId),
      })),
    };
  } catch (error) {
    console.error("Error fetching project releases:", error);
    return {
      status: 'error',
      statusCode: '500',
      message: 'Failed to fetch releases',
      data: [],
    };
  }
};

export const getReleaseTestCaseCountsLoad = async (releaseIds: number[]) => {
  try {
    const counts = await Promise.all(
      releaseIds.map(async (id) => {
        try {
          const res = await apiClient.get(`/api/v1/release/${id}/test-case`);
          const list = res.data?.data || res.data || [];
          return {
            releaseId: id,
            testCaseCount: Array.isArray(list) ? list.length : 0,
          };
        } catch {
          return { releaseId: id, testCaseCount: 0 };
        }
      })
    );
    return {
      status: 'success',
      statusCode: 200,
      data: counts,
    };
  } catch {
    return {
      status: 'success',
      statusCode: 200,
      data: releaseIds.map((id) => ({ releaseId: id, testCaseCount: 0 })),
    };
  }
};