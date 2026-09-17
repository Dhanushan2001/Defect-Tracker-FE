import apiClient from "../../lib/api";
import { ENDPOINTS } from "../../utils/apiendpoint";

export interface SimpleUser {
  id: number;
  userId: string;
  firstName: string;
  lastName: string;
  designationId?: number;
  designationName?: string;
  gender?: string;
  email?: string;
  contactNo?: string;
  joinDate?: string;
  isActive?: boolean;
}

interface GetUsersByDesignationResponse {
  status: string;
  data: SimpleUser[];
}

export async function getAllUsers(page: number = 0, size: number = 10) {
  const response = await apiClient.get(
    `${ENDPOINTS.employee}?page=${page}&size=${size}&sort=id&direction=ASC`
  );
  return response.data;
}

export async function getAllUsersSimple() {
  const response = await apiClient.get(`${ENDPOINTS.employee}?sort=id&direction=ASC`);
  const data = response.data;
  const list = Array.isArray(data.data)
    ? data.data
    : Array.isArray(data.data?.content)
    ? data.data.content
    : [];

  list.sort((a: any, b: any) => Number(a.id) - Number(b.id));

  return {
    status: data.status || "success",
    statusCode: data.statusCode || 200,
    data: list,
  };
}

export async function getUsersByDesignationId(
  designationId: number
): Promise<GetUsersByDesignationResponse> {
  const response = await getAllUsersSimple();
  const list = Array.isArray(response.data) ? response.data : [];
  const filtered = list.filter(
    (u: any) => Number(u.designationId) === Number(designationId)
  );
  return {
    status: "success",
    data: filtered,
  };
}

export default getAllUsers;
