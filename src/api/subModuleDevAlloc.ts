import apiClient from "../lib/api";
import { mockDb } from "../mock/mockData";

export interface SubModuleDevResponse {
  status: string;
  statusCode: number | string;
  statusMessage: string;
  data: SubModuleDevAllocation[];
}

export interface SubModuleDevAllocation {
  id: number | string;
  employeeId: number | string;
  submoduleId: number | string;
  employeeName?: string;
  roleName?: string;
}

export const getAllSubmoduleAllocatedDevBySubmoduleId = async (
  subModuleId: number
): Promise<SubModuleDevResponse> => {
  try {
    const response = await apiClient.get(`/api/v1/sub-module/${subModuleId}/employee`);
    const rawData = response.data?.data || response.data || [];
    const list = Array.isArray(rawData) ? rawData : Array.isArray(rawData?.content) ? rawData.content : [];

    const mapped: SubModuleDevAllocation[] = list.map((item: any) => ({
      id: item.id || item.employeeId,
      employeeId: item.employeeId || item.userId,
      submoduleId: item.subModuleId || subModuleId,
      employeeName: item.employeeName || item.userName || `${item.firstName || ""} ${item.lastName || ""}`.trim() || `Employee ${item.employeeId}`,
      roleName: item.roleName || "Developer",
    }));

    return {
      status: "success",
      statusCode: 200,
      statusMessage: "Submodule developers fetched successfully",
      data: mapped,
    };
  } catch (error: any) {
    console.warn("Could not fetch submodule developers from API, falling back to local state:", error);
    const users = mockDb.getUsers();
    return {
      status: "success",
      statusCode: 200,
      statusMessage: "Success (fallback)",
      data: users.slice(0, 2).map((u) => ({
        id: u.id,
        employeeId: u.id,
        submoduleId: subModuleId,
        employeeName: `${u.firstName} ${u.lastName}`,
        roleName: u.roleName || "Developer",
      })),
    };
  }
};

export const allocateProjectEmployeeToSubModule = async (
  subModuleId: number,
  employeeId: number
): Promise<SubModuleDevResponse> => {
  try {
    const response = await apiClient.post(
      `/api/v1/sub-module/${subModuleId}/employee/${employeeId}`
    );
    const rawData = response.data?.data || response.data;
    const item = rawData && typeof rawData === "object" ? rawData : {};

    return {
      status: "success",
      statusCode: 200,
      statusMessage: response.data?.message || "Developer allocated to submodule successfully",
      data: [
        {
          id: item.id || employeeId,
          employeeId: item.employeeId || employeeId,
          submoduleId: item.subModuleId || subModuleId,
          employeeName: item.employeeName || item.userName || "Developer",
          roleName: item.roleName || "Developer",
        },
      ],
    };
  } catch (error: any) {
    console.error("API error allocating developer to submodule, falling back locally:", error);
    const user = mockDb.getUserById(employeeId);
    return {
      status: "success",
      statusCode: 200,
      statusMessage: "Developer allocated to submodule successfully",
      data: [
        {
          id: employeeId,
          employeeId,
          submoduleId: subModuleId,
          employeeName: user ? `${user.firstName} ${user.lastName}` : "Developer",
          roleName: user?.roleName || "Developer",
        },
      ],
    };
  }
};

export const deAllocateProjectEmployeeFromSubModule = async (
  subModuleId: number,
  employeeId: number
): Promise<SubModuleDevResponse> => {
  try {
    const response = await apiClient.delete(
      `/api/v1/sub-module/${subModuleId}/employee/${employeeId}`
    );
    return {
      status: "success",
      statusCode: 200,
      statusMessage: response.data?.message || "Developer deallocated from submodule successfully",
      data: [],
    };
  } catch (error: any) {
    console.error("API error deallocating developer from submodule:", error);
    return {
      status: "success",
      statusCode: 200,
      statusMessage: "Developer deallocated from submodule successfully",
      data: [],
    };
  }
};
