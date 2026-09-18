import apiClient from "../../lib/api";

export const getReleasesByProjectId = async (projectId: string | number) => {
  try {
    const response = await apiClient.get(`/api/v1/project/${projectId}/release`);
    const list = response.data?.data || response.data || [];
    const releases = Array.isArray(list) ? list : [];
    return releases.sort((a: any, b: any) => Number(a.id) - Number(b.id));
  } catch (error) {
    return [];
  }
};
