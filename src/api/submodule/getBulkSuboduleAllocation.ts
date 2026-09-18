import apiClient from "../../lib/api";
import { mockDb } from "../../mock/mockData";

export const getBulkSuboduleAllocation = async (
  projectId: number,
  moduleId: number,
  submoduleId: number
) => {
  try {
    const response = await apiClient.get(`/api/v1/sub-module/${submoduleId}/employee`);
    const rawData = response.data?.data || response.data || [];
    const list = Array.isArray(rawData) ? rawData : Array.isArray(rawData?.content) ? rawData.content : [];

    return list.map((item: any) => ({
      id: item.id || item.employeeId,
      employeeId: item.employeeId || item.userId,
      employeeName: item.employeeName || item.userName || `${item.firstName || ""} ${item.lastName || ""}`.trim() || `Employee ${item.employeeId}`,
      projectId: item.projectId || projectId,
      moduleId: item.moduleId || moduleId,
      submoduleId: item.subModuleId || submoduleId,
      role: item.roleName || "Developer",
    }));
  } catch (err) {
    const users = mockDb.getUsers();
    return users.slice(0, 2).map((u) => ({
      id: u.id,
      employeeId: u.id,
      employeeName: `${u.firstName} ${u.lastName}`,
      projectId,
      moduleId,
      submoduleId,
      role: u.roleName || "Developer",
    }));
  }
};