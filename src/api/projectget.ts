import { Project } from "../types";
import apiClient from "../lib/api";
import { ENDPOINTS } from "../utils/apiendpoint";

export const getAllProjects = async (): Promise<Project[]> => {
  try {
    const response = await apiClient.get(ENDPOINTS.project);
    const data = response.data?.data || response.data;
    const list = Array.isArray(data)
      ? data
      : Array.isArray(data?.content)
      ? data.content
      : [];
    return list;
  } catch (error) {
    console.error("API: getAllProjects failed", error);
    return [];
  }
};

export const getAllProjectsForDashbord = async (): Promise<any> => {
  try {
    const projects = await getAllProjects();
    return {
      status: "success",
      statusCode: 200,
      data: projects,
    };
  } catch (error) {
    return {
      status: "error",
      statusCode: 500,
      data: [],
    };
  }
};

export async function updateProject(id: number | string, projectData: any) {
  const response = await apiClient.put(ENDPOINTS.projectById(Number(id)), projectData);
  return response.data;
}

export async function deleteProject(id: string | number) {
  const response = await apiClient.delete(ENDPOINTS.projectById(Number(id)));
  return response.data;
}

export async function createProject(project: any) {
  const response = await apiClient.post(ENDPOINTS.project, project);
  return response.data;
}

export interface AvailableManager {
  employeeId: number;
  firstName: string;
  lastName: string;
  email: string;
  designationId: number;
  designationName: string;
  availabilityPercent: number;
  isActive: boolean;
}

export const getAvailableManagers = async (designationId?: number): Promise<AvailableManager[]> => {
  if (!designationId) return [];
  try {
    const response = await apiClient.get(ENDPOINTS.availableManagers(designationId));
    const data = response.data?.data || response.data;
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
    if (Array.isArray(data)) {
      return [];
    }
  } catch (error) {
    console.warn("Endpoints availableManagers call failed, using employee fallback:", error);
  }

  // Fallback: Fetch employees and filter by designation
  try {
    const res = await apiClient.get(`${ENDPOINTS.employee}?sort=id&direction=ASC`);
    const users = res.data?.data || res.data || [];
    const list = Array.isArray(users) ? users : Array.isArray(users?.content) ? users.content : [];
    return list
      .filter(
        (u: any) =>
          Number(u.designationId) === Number(designationId) &&
          u.isActive !== false &&
          u.status !== "inactive"
      )
      .map((u: any) => ({
        employeeId: u.id,
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        designationId: Number(u.designationId),
        designationName: u.designationName || "",
        availabilityPercent: u.availability !== undefined ? Number(u.availability) : 100,
        isActive: u.isActive !== false,
      }));
  } catch (err) {
    console.error("Failed to load available managers fallback:", err);
    return [];
  }
};

export const getAvailableManagersForUpdate = async (
  designationId?: number,
  projectId?: number
): Promise<AvailableManager[]> => {
  if (!designationId) return [];
  try {
    const url = projectId
      ? ENDPOINTS.availableManagersForUpdate(designationId, projectId)
      : ENDPOINTS.availableManagers(designationId);
    const response = await apiClient.get(url);
    const data = response.data?.data || response.data;
    if (Array.isArray(data)) {
      return data;
    }
  } catch {
    // fallback
  }
  return getAvailableManagers(designationId);
};
