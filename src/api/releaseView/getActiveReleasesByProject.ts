import apiClient from "../../lib/api";

export interface ActiveRelease {
  id: string;
  name: string;
  status: string;
}

export const getActiveReleasesByProject = async (
  projectId: string | number
): Promise<ActiveRelease[]> => {
  try {
    const response = await apiClient.get(`/api/v1/project/${projectId}/release/active`);
    const list = response.data?.data || response.data || [];
    const releases = Array.isArray(list) ? list : [];
    releases.sort((a: any, b: any) => Number(a.id) - Number(b.id));
    return releases.map((r: any) => ({
      id: String(r.id),
      name: r.name || r.releaseName || 'Release',
      status: r.status || 'In Progress',
    }));
  } catch (error) {
    return [];
  }
};