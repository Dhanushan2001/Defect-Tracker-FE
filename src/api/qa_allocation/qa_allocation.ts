import apiClient from "../../lib/api";
import { mockDb } from "../../mock/mockData";

export interface QAMember {
  userId: number;
  userFullName: string;
}

export interface QAMembersResponse {
  status: string;
  statusCode: number;
  message: string;
  data: QAMember[];
}

export const getQAMembersByProjectId = async (projectId: number): Promise<QAMembersResponse> => {
  try {
    const res = await apiClient.get(`/api/v1/project/${projectId}/qa-members`);
    const members = res.data?.data || res.data || [];
    if (Array.isArray(members) && members.length > 0) {
      return {
        status: "success",
        statusCode: 200,
        message: "QA members retrieved successfully",
        data: members.map((m: any) => ({
          userId: m.userId || m.id,
          userFullName: m.userFullName || m.name || `QA Member ${m.id}`,
        })),
      };
    }
  } catch (error) {
    console.warn(`Error fetching QA members for project ${projectId}, falling back to mock:`, error);
  }

  const users = mockDb.getUsers();
  const qaMembers = users.filter((u) => u.designationName?.includes("QA") || u.roleName?.includes("QA"));

  return {
    status: "success",
    statusCode: 200,
    message: "QA members retrieved successfully",
    data: qaMembers.map((u) => ({
      userId: u.id,
      userFullName: `${u.firstName} ${u.lastName}`,
    })),
  };
};