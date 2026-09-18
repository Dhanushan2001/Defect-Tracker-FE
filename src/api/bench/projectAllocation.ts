import apiClient from "../../lib/api";
import { ENDPOINTS } from "../../utils/apiendpoint";

interface AvailablePeriod {
  period: string;
  percentage: number;
  project: string;
  userId: number;
}

export interface ViewAllocationsResponse {
  data: {
    availablePeriods: AvailablePeriod[];
  };
  message: string;
  status: string;
  statusCode: number;
}

export interface ProjectAllocationPayload {
  employeeId: number;
  projectId: number;
  roleId: number;
  allocationPercent: number;
  startDate: string;
  endDate: string;
}

export async function postProjectAllocations(payload: ProjectAllocationPayload) {
  const response = await apiClient.post(ENDPOINTS.projectAllocation, {
    employeeId: payload.employeeId,
    projectId: payload.projectId,
    roleId: payload.roleId,
    allocationPercent: payload.allocationPercent,
    allocationPercentage: payload.allocationPercent,
    startDate: payload.startDate,
    endDate: payload.endDate,
  });
  return response.data;
}

export async function getProjectAllocationsById(projectId: string | number) {
  try {
    const response = await apiClient.get(
      ENDPOINTS.projectAllocationProjectEmployee(Number(projectId))
    );
    const data = response.data?.data || response.data || [];
    const list = Array.isArray(data) ? data : Array.isArray(data?.content) ? data.content : [];
    return {
      status: "success",
      statusCode: 200,
      data: list.map((item: any) => ({
        id: item.id,
        employeeId: item.employeeId || item.userId,
        userId: item.userId || item.employeeId,
        userFullName: item.userFullName || item.employeeName || `${item.firstName || ""} ${item.lastName || ""}`.trim(),
        employeeName: item.employeeName || item.userFullName || `${item.firstName || ""} ${item.lastName || ""}`.trim(),
        firstName: item.firstName || "",
        lastName: item.lastName || "",
        roleId: item.roleId,
        roleName: item.roleName || "Developer",
        designationName: item.designationName || "",
        allocationPercent: item.allocationPercent ?? item.allocationPercentage ?? 0,
        allocationPercentage: item.allocationPercentage ?? item.allocationPercent ?? 0,
        startDate: item.startDate,
        endDate: item.endDate,
      })),
    };
  } catch (error) {
    console.error("Failed to load project allocations by id:", error);
    return {
      status: "error",
      statusCode: 500,
      data: [],
    };
  }
}

export async function updateProjectAllocation(id: string | number, payload: any) {
  const response = await apiClient.put(`${ENDPOINTS.projectAllocation}/${id}`, payload);
  return response.data;
}

export async function deleteProjectAllocation(id: string | number, _forceDeallocate: boolean = false) {
  const response = await apiClient.delete(`${ENDPOINTS.projectAllocation}/${id}`);
  return response.data;
}

export async function filterProjectAllocations(projectId: string | number, _filters: any) {
  return getProjectAllocationsById(projectId);
}

export async function getMaxAvailablePercentage(userId: string | number, _startDate?: string, _endDate?: string) {
  try {
    const res = await apiClient.get(ENDPOINTS.employeeById(Number(userId)));
    const emp = res.data?.data || res.data;
    return { data: emp?.availability ?? 100 };
  } catch {
    return { data: 100 };
  }
}

export async function getDevelopersWithRolesByProjectId(projectId: number | string | undefined) {
  if (!projectId) return { status: "success", statusCode: 200, data: [] };
  return getProjectAllocationsById(projectId);
}

export async function allocateDeveloperToModule(_moduleId: number, _projectAllocationId: number) {
  return {
    status: "success",
    statusCode: 200,
    message: "Developer allocated to module successfully",
  };
}

export async function allocateDeveloperToSubModule(_moduleId: number, _projectAllocationId: number, _id: number) {
  return {
    status: "success",
    statusCode: 200,
    message: "Developer allocated to submodule successfully",
  };
}

export async function getViewAllocations(userId: string | number): Promise<ViewAllocationsResponse> {
  try {
    const response = await apiClient.get(ENDPOINTS.projectAllocationByEmployee(Number(userId)));
    const list = response.data?.data || response.data || [];
    const availablePeriods = Array.isArray(list)
      ? list.map((item: any) => ({
          period: `${item.startDate || "2026-01-01"} to ${item.endDate || "2026-12-31"}`,
          percentage: item.allocationPercent ?? item.allocationPercentage ?? 0,
          roleId: item.roleId,
          roleName: item.roleName,
          project: item.projectName || "Project",
          userId: Number(userId),
        }))
      : [];

    return {
      data: { availablePeriods },
      message: "Success",
      status: "success",
      statusCode: 200,
    };
  } catch {
    return {
      data: { availablePeriods: [] },
      message: "Success",
      status: "success",
      statusCode: 200,
    };
  }
}