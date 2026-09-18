import apiClient from "../lib/api";
import { mockDb } from "../mock/mockData";

export type RoleType =
  | "ADMIN"
  | "PROJECT_MANAGER"
  | "QA_LEAD"
  | "QA_ENGINEER"
  | "DEV_LEAD"
  | "SENIOR_DEVELOPER"
  | "DEVELOPER"
  | "JUNIOR_DEVELOPER"
  | "BUSINESS_ANALYST"
  | "UI_UX_DESIGNER"
  | "DEVOPS_ENGINEER"
  | "SUPPORT_ENGINEER"
  | "CLIENT";

let cachedRoles: any[] | null = null;

const getLiveRoles = async (): Promise<any[]> => {
  if (cachedRoles && cachedRoles.length > 0) {
    return cachedRoles;
  }
  try {
    const response = await apiClient.get("/api/v1/role");
    const raw = response.data?.data || response.data || [];
    const list = Array.isArray(raw) ? raw : Array.isArray(raw?.content) ? raw.content : [];
    if (list.length > 0) {
      cachedRoles = list;
      return list;
    }
  } catch (_) {}
  return mockDb.getRoles();
};

export const roleTypeBasedRoleFetch = async (
  roleType: RoleType,
): Promise<string[]> => {
  const roles = await getLiveRoles();
  return roles
    .filter((role) => {
      const typeStr = ((role.type || role.roleType || "") as string).toUpperCase();
      const rName = ((role.name || role.roleName || "") as string).toUpperCase();
      return (
        typeStr === roleType ||
        rName.includes(roleType.replace("_", " ")) ||
        (roleType === "DEVELOPER" && (rName === "DEV" || rName.includes("DEVELOP"))) ||
        (roleType === "DEV_LEAD" && (rName === "DEV" || rName.includes("DEV"))) ||
        (roleType === "QA_LEAD" && (rName === "QA" || rName.includes("QA"))) ||
        (roleType === "QA_ENGINEER" && (rName === "QA" || rName.includes("QA")))
      );
    })
    .map((role) => role.name || role.roleName);
};

export const roleTypesBasedRoleFetch = async (
  roleTypes: RoleType[],
): Promise<string[]> => {
  const roles = await getLiveRoles();
  return roles
    .filter((role) => {
      const typeStr = ((role.type || role.roleType || "") as string).toUpperCase();
      const rName = ((role.name || role.roleName || "") as string).toUpperCase();
      return roleTypes.some(
        (t) =>
          typeStr === t ||
          rName.includes(t.replace("_", " ")) ||
          (t === "DEVELOPER" && (rName === "DEV" || rName.includes("DEVELOP"))) ||
          (t === "DEV_LEAD" && (rName === "DEV" || rName.includes("DEV"))) ||
          (t === "QA_LEAD" && (rName === "QA" || rName.includes("QA"))) ||
          (t === "QA_ENGINEER" && (rName === "QA" || rName.includes("QA")))
      );
    })
    .map((role) => role.name || role.roleName);
};

export const roleTypeBasedRoleIdFetch = async (
  roleType: RoleType,
): Promise<number[]> => {
  const roles = await getLiveRoles();
  return roles
    .filter((role) => {
      const typeStr = ((role.type || role.roleType || "") as string).toUpperCase();
      const rName = ((role.name || role.roleName || "") as string).toUpperCase();
      return (
        typeStr === roleType ||
        rName.includes(roleType.replace("_", " ")) ||
        (roleType === "DEVELOPER" && (rName === "DEV" || rName.includes("DEVELOP"))) ||
        (roleType === "DEV_LEAD" && (rName === "DEV" || rName.includes("DEV"))) ||
        (roleType === "QA_LEAD" && (rName === "QA" || rName.includes("QA"))) ||
        (roleType === "QA_ENGINEER" && (rName === "QA" || rName.includes("QA")))
      );
    })
    .map((role) => role.id);
};