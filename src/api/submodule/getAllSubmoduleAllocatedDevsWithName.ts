import apiClient from "../../lib/api";
import { mockDb } from "../../mock/mockData";

export interface SubDevWithName {
  id: number;
  employeeId: number;
  submoduleId: number;
  employeeName?: string;
  roleName?: string;
}

export interface SubDevWithNameResponse {
  status: number;
  statusCode: string;
  statusMessage: string;
  data: SubDevWithName[];
}

export const getAllSubDevwithName = async (
  submoduleId: number
): Promise<SubDevWithNameResponse> => {
  try {
    const response = await apiClient.get(`/api/v1/sub-module/${submoduleId}/employee`);
    const rawData = response.data?.data || response.data || [];
    const list = Array.isArray(rawData) ? rawData : Array.isArray(rawData?.content) ? rawData.content : [];

    const mapped: SubDevWithName[] = list.map((item: any) => ({
      id: item.id || item.employeeId,
      employeeId: item.employeeId || item.userId,
      submoduleId: item.subModuleId || submoduleId,
      employeeName: item.employeeName || item.userName || `${item.firstName || ""} ${item.lastName || ""}`.trim() || `Employee ${item.employeeId}`,
      roleName: item.roleName || "Developer",
    }));

    return {
      status: 200,
      statusCode: "200",
      statusMessage: "Success",
      data: mapped,
    };
  } catch (err) {
    console.warn("Could not fetch submodule devs via API, using fallback:", err);
    const users = mockDb.getUsers();
    return {
      status: 200,
      statusCode: "200",
      statusMessage: "Success",
      data: users.slice(0, 2).map((u) => ({
        id: u.id,
        employeeId: u.id,
        submoduleId,
        employeeName: `${u.firstName} ${u.lastName}`,
        roleName: u.roleName || "Developer",
      })),
    };
  }
};

export default getAllSubDevwithName;