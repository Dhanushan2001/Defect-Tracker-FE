import apiClient from "../../lib/api";
import { mockDb } from "../../mock/mockData";

export type ExecutionStatus =
  | "not-started"
  | "in-progress"
  | "passed"
  | "failed"
  | "blocked";

const EXECUTION_STATUS_KEY = "executionStatuses";

export function getExecutionStatuses(
  projectId: string | number,
  releaseId: string | number
): Record<string, ExecutionStatus> {
  try {
    const raw = localStorage.getItem(EXECUTION_STATUS_KEY);
    if (!raw) return {};
    const all: Record<string, any> = JSON.parse(raw);
    const proj = all[String(projectId)] || {};
    return (proj[String(releaseId)] || {}) as Record<string, ExecutionStatus>;
  } catch {
    return {};
  }
}

export function setExecutionStatus(
  projectId: string | number,
  releaseId: string | number,
  testCaseId: string | number,
  status: ExecutionStatus
): Record<string, ExecutionStatus> {
  let all: Record<string, any> = {};
  try {
    const raw = localStorage.getItem(EXECUTION_STATUS_KEY);
    all = raw ? JSON.parse(raw) : {};
  } catch {
    all = {};
  }

  const pid = String(projectId);
  const rid = String(releaseId);
  if (!all[pid]) all[pid] = {};
  if (!all[pid][rid]) all[pid][rid] = {};
  all[pid][rid][String(testCaseId)] = status;

  localStorage.setItem(EXECUTION_STATUS_KEY, JSON.stringify(all));

  // Also update in mockDb test cases
  const dbStatus = status === 'passed' ? 'PASS' : status === 'failed' ? 'FAIL' : status === 'blocked' ? 'BLOCKED' : 'NOT_RUN';
  mockDb.updateTestCase(Number(testCaseId), { executionStatus: dbStatus as any });

  return all[pid][rid] as Record<string, ExecutionStatus>;
}

export function setBulkExecutionStatuses(
  projectId: string | number,
  releaseId: string | number,
  statuses: Record<string, ExecutionStatus>
): void {
  let all: Record<string, any> = {};
  try {
    const raw = localStorage.getItem(EXECUTION_STATUS_KEY);
    all = raw ? JSON.parse(raw) : {};
  } catch {
    all = {};
  }

  const pid = String(projectId);
  const rid = String(releaseId);
  if (!all[pid]) all[pid] = {};
  all[pid][rid] = { ...(all[pid][rid] || {}), ...statuses };
  localStorage.setItem(EXECUTION_STATUS_KEY, JSON.stringify(all));
}

export const updateReleaseTestCaseStatus = async (
  releaseId: number,
  releaseTestCaseId: number,
  payload: {
    status?: "PASSED" | "FAILED" | "PASS" | "FAIL";
    testCaseStatus?: "PASS" | "FAIL";
    priorityId?: number;
    assignedTo?: number;
  }
): Promise<any> => {
  const normStatus = (payload.status === "PASSED" || payload.status === "PASS" || payload.testCaseStatus === "PASS") ? "PASS" : "FAIL";

  try {
    let response;
    if (releaseId && releaseTestCaseId) {
      response = await apiClient.patch(
        `/api/v1/release/${releaseId}/test-case/${releaseTestCaseId}/status`,
        { status: normStatus, ...payload }
      );
    } else if (releaseTestCaseId) {
      response = await apiClient.patch(
        `/api/v1/release-test-case/${releaseTestCaseId}/status`,
        { status: normStatus, ...payload }
      );
    }
    const data = response?.data?.data || response?.data;
    return {
      status: "success",
      statusCode: 200,
      message: "Test case status updated successfully",
      data,
    };
  } catch (error) {
    console.warn("Backend execution status update failed, falling back locally:", error);
    mockDb.updateTestCase(releaseTestCaseId, {
      executionStatus: normStatus,
    });
    return {
      status: "success",
      statusCode: 200,
      message: "Test case status updated successfully",
    };
  }
};

export const updateReleaseTestCaseStatusWithImage = async (
  releaseId: number,
  releaseTestCaseId: number,
  formData: FormData
): Promise<any> => {
  let defectData: any = {};
  const dataBlob = formData.get("data");
  if (dataBlob) {
    try {
      if (typeof dataBlob === "string") {
        defectData = JSON.parse(dataBlob);
      } else if (dataBlob instanceof Blob) {
        const text = await dataBlob.text();
        defectData = JSON.parse(text);
      }
    } catch (err) {
      console.warn("Could not parse data from FormData:", err);
    }
  }

  formData.forEach((val, key) => {
    if (key !== "data" && typeof val === "string") {
      defectData[key] = val;
    }
  });

  try {
    const postPayload = {
      title: defectData.title || `Defect for Test Case ${releaseTestCaseId}`,
      description: defectData.description || defectData.title || "Defect reported during test execution",
      steps: defectData.steps || "",
      projectId: Number(defectData.projectId || 1),
      releaseId: Number(defectData.releaseId || releaseId),
      moduleId: defectData.moduleId ? Number(defectData.moduleId) : undefined,
      subModuleId: defectData.subModuleId ? Number(defectData.subModuleId) : undefined,
      testCaseId: Number(defectData.testCaseId || releaseTestCaseId),
      assignedTo: Number(defectData.assignedTo || defectData.assigntoId || 1),
      reportedBy: defectData.reportedBy ? Number(defectData.reportedBy) : undefined,
      priorityId: defectData.priorityId ? Number(defectData.priorityId) : undefined,
      severityId: defectData.severityId ? Number(defectData.severityId) : undefined,
      defectTypeId: defectData.defectTypeId ? Number(defectData.defectTypeId) : undefined,
      defectStatusId: defectData.defectStatusId ? Number(defectData.defectStatusId) : 1,
      status: "FAILED",
    };

    const response = await apiClient.post("/api/v1/defect", postPayload);
    const data = response.data?.data || response.data;

    return {
      status: "success",
      statusCode: 201,
      message: "Test case marked as failed and defect created",
      data: {
        defectNo: data?.defectNo || (data?.id ? `DEF-${String(data.id).padStart(3, "0")}` : "DEF-001"),
        assignedTo: data?.assignedTo || data?.assignedToName || "Developer",
        assignedToId: data?.assignedToId || postPayload.assignedTo,
        priorityName: data?.priorityName || "Medium",
        ...data,
      },
    };
  } catch (error) {
    console.warn("Backend defect creation on fail failed, falling back locally:", error);
    const fallbackDefect = mockDb.createDefect({
      title: defectData.title || 'Defect',
      description: defectData.description || '',
      steps: defectData.steps || '',
      projectId: Number(defectData.projectId || 1),
      severityId: Number(defectData.severityId || 2),
      priorityId: Number(defectData.priorityId || 2),
      defectStatusId: 1,
      moduleId: Number(defectData.moduleId || 1),
      subModuleId: Number(defectData.subModuleId || 1),
      releaseId: Number(releaseId),
      assignedToId: Number(defectData.assignedTo || 3),
      assignedById: 1,
    });
    const user = mockDb.getUserById(Number(defectData.assignedTo || 3));
    const userName = user ? `${user.firstName} ${user.lastName}` : "Assigned Dev";
    const defectNo = `DEF-${String(fallbackDefect.id).padStart(3, '0')}`;

    return {
      status: 'success',
      statusCode: 200,
      data: {
        defectNo,
        assignedTo: userName,
        priorityName: "Medium",
      },
    };
  }
};