import apiClient from "../../lib/api";
import { mockDb } from "../../mock/mockData";

export interface UserByAllocation {
  userId: number;
  userName: string;
  userRole?: string;
  userWithRole: string;
  allocateModuleId?: number;
  allocationId?: number;
  moduleName?: string;
  projectName?: string;
  moduleId?: number;
  projectId?: number;
  subModuleId?: number;
}

export const getUsersByAllocation = async (projectId: number, moduleId: number): Promise<UserByAllocation[]> => {
  try {
    const response = await apiClient.get(`/api/v1/module/${moduleId}/allocated-leader`);
    const resData = response.data?.data || response.data;
    if (resData && resData.userId) {
      const name = resData.userName || resData.employeeName || `User ${resData.userId}`;
      const roleName = resData.roleName || "QA Lead";
      return [
        {
          allocateModuleId: resData.allocateModuleId || 1,
          moduleId: resData.moduleId || moduleId,
          userId: resData.userId,
          userName: name,
          userRole: roleName,
          userWithRole: `${name}-${roleName}`,
          projectId: projectId,
        },
      ];
    }
  } catch (err) {
    console.warn("Could not fetch allocated leader for module, falling back to mockDb:", err);
  }

  const mod = mockDb.getModuleById(moduleId);
  if (!mod || !mod.leaderId) return [];
  const user = mockDb.getUserById(mod.leaderId);
  const roleName = user?.roleName || "QA Lead";
  const name = mod.leaderName || (user ? `${user.firstName} ${user.lastName}` : `User ${mod.leaderId}`);
  return [
    {
      allocateModuleId: 1,
      moduleId: mod.id,
      userId: mod.leaderId,
      userName: name,
      userRole: roleName,
      userWithRole: `${name}-${roleName}`,
      projectId: projectId,
    },
  ];
};

export const getUsersBySubmoduleAllocation = async (
  projectId: number,
  moduleId: number,
  subModuleId: number
): Promise<UserByAllocation[]> => {
  const users = mockDb.getUsers();
  return users.slice(0, 2).map((u) => ({
    allocationId: u.id,
    userId: u.id,
    userName: `${u.firstName} ${u.lastName}`,
    userWithRole: `${u.firstName} ${u.lastName}`,
    userRole: u.roleName || "Developer",
    moduleId,
    projectId,
    subModuleId,
  }));
};

export async function getUsersByModuleSubmoduleAllocation(projectId: number) {
  const users = mockDb.getUsers();
  return {
    status: "success",
    message: "Developers retrieved successfully",
    data: users.map((u) => ({
      employeeId: u.id,
      employeeName: `${u.firstName} ${u.lastName}`,
      roleName: u.roleName || "Developer",
      projectId,
    })),
    statusCode: 200,
  };
}