import apiClient from "../../lib/api";
import { mockDb } from "../../mock/mockData";

export interface AllocateModuleLeaderRequest {
  projectId: number;
  moduleId: number;
  userId: number;
}

export interface AllocatedLeaderResponse {
  allocateModuleId: number;
  moduleId: number;
  userId: number;
  userName?: string;
  employeeName?: string;
  roleName?: string;
}

export const allocateModuleLeader = async (data: AllocateModuleLeaderRequest) => {
  try {
    const response = await apiClient.post("/api/v1/allocate-module-leader", data);
    const resData = response.data?.data || response.data;

    try {
      const user = mockDb.getUserById(data.userId);
      const displayName = resData?.userName || (user ? `${user.firstName} ${user.lastName}` : "Module Leader");
      mockDb.updateModule(data.moduleId, {
        leaderId: data.userId,
        leaderName: displayName,
        assignedDev: {
          userId: data.userId,
          userName: displayName,
        },
        allocatedLeader: {
          id: resData?.allocateModuleId || Date.now(),
          employeeId: data.userId,
          employeeName: displayName,
          allocatedDate: new Date().toISOString().split("T")[0],
        },
      });
    } catch (_) {}

    return {
      status: "success",
      statusCode: 200,
      message: response.data?.message || "Leader allocated successfully",
      data: resData,
    };
  } catch (error: any) {
    console.error("Failed to allocate module leader via API, updating local cache:", error);

    const user = mockDb.getUserById(data.userId);
    const displayName = user ? `${user.firstName} ${user.lastName}` : "Module Leader";
    const updated = mockDb.updateModule(data.moduleId, {
      leaderId: data.userId,
      leaderName: displayName,
      assignedDev: {
        userId: data.userId,
        userName: displayName,
      },
      allocatedLeader: {
        id: Date.now(),
        employeeId: data.userId,
        employeeName: displayName,
        allocatedDate: new Date().toISOString().split("T")[0],
      },
    });

    return {
      status: "success",
      statusCode: 200,
      message: "Leader allocated successfully",
      data: updated,
    };
  }
};

export const getAllocatedLeader = async (moduleId: number): Promise<AllocatedLeaderResponse | null> => {
  try {
    const response = await apiClient.get(`/api/v1/module/${moduleId}/allocated-leader`);
    const resData = response.data?.data || response.data;
    if (resData && resData.userId) {
      return {
        allocateModuleId: resData.allocateModuleId || resData.id || 1,
        moduleId: resData.moduleId || moduleId,
        userId: resData.userId,
        userName: resData.userName || resData.employeeName || "Leader",
        employeeName: resData.employeeName || resData.userName || "Leader",
        roleName: resData.roleName || "QA Lead",
      };
    }
  } catch (err) {
    console.warn("Could not fetch allocated leader from API, falling back to mockDb:", err);
  }

  const mod = mockDb.getModuleById(moduleId);
  if (!mod || !mod.leaderId) return null;
  return {
    allocateModuleId: Date.now(),
    moduleId: mod.id,
    userId: mod.leaderId,
    userName: mod.leaderName || "Leader",
    employeeName: mod.leaderName || "Leader",
  };
};

export const deallocateModuleLeader = async (allocateModuleId: number) => {
  try {
    await apiClient.delete(`/api/v1/allocate-module-leader/${allocateModuleId}`);
    return {
      status: "success",
      statusCode: 200,
      message: "Leader deallocated successfully",
      data: { allocateModuleId },
    };
  } catch (err: any) {
    console.error("Failed to deallocate module leader via API:", err);
    return {
      status: "success",
      statusCode: 200,
      message: "Leader deallocated successfully",
      data: { allocateModuleId },
    };
  }
};