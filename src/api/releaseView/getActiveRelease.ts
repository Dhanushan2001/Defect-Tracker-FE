import apiClient from "../../lib/api";

export const getActiveRelease = async (projectId: string | number) => {
  try {
    const response = await apiClient.get(`/api/v1/project/${projectId}/release/active`);
    const list = response.data?.data || response.data || [];
    const releases = Array.isArray(list) ? list : [];
    return {
      status: 'success',
      statusCode: 200,
      data: releases.map((r: any) => ({
        ...r,
        releaseName: r.name || r.releaseName,
      })),
    };
  } catch (error) {
    return {
      status: 'error',
      statusCode: 500,
      data: [],
    };
  }
};
