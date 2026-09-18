import apiClient from "../../lib/api";
import { mockDb } from "../../mock/mockData";

export interface allocated_testcases {
  projectId?: number;
  releaseId?: string | number;
  moduleId?: number;
  subModuleId?: number;
}

export interface allocated_testcase_details {
  id: number;
  testCaseId: string;
  description: string;
  steps: string;
  type: string;
  severity: string;
}

export interface GetAllocatedTestCases_Response {
  status: string;
  statusCode: number;
  message: string;
  data: allocated_testcase_details[];
}

export async function getAllocatedTestCases({
  releaseId,
  moduleId,
  subModuleId,
}: allocated_testcases): Promise<GetAllocatedTestCases_Response> {
  try {
    if (releaseId) {
      const res = await apiClient.get(`/api/v1/release/${releaseId}/test-case`, {
        params: { moduleId, subModuleId },
      });
      const items = res.data?.data || res.data || [];
      if (Array.isArray(items)) {
        return {
          status: "success",
          statusCode: 200,
          message: "Allocated test cases retrieved successfully",
          data: items.map((t: any) => ({
            id: t.testcaseId || t.id,
            testCaseId: t.testCaseNo || t.testCaseId || `TC-${t.id}`,
            description: t.description || t.name || "",
            steps: t.detailsSteps || t.steps || "",
            type: t.defectTypeName || t.type || "Functional Bug",
            severity: t.severityName || t.severity || "Medium",
          })),
        };
      }
    } else if (subModuleId) {
      const res = await apiClient.get(`/api/v1/sub-module/${subModuleId}/test-case`);
      const items = res.data?.data || res.data || [];
      if (Array.isArray(items)) {
        return {
          status: "success",
          statusCode: 200,
          message: "Allocated test cases retrieved successfully",
          data: items.map((t: any) => ({
            id: t.id,
            testCaseId: t.testcaseNo || t.testCaseId || `TC-${t.id}`,
            description: t.description || "",
            steps: t.detailsSteps || t.steps || "",
            type: t.defectTypeName || "Functional Bug",
            severity: t.severityName || "Medium",
          })),
        };
      }
    }
  } catch (error) {
    console.warn("Failed to fetch allocated test cases from API, using fallback:", error);
  }

  const testCases = mockDb.getTestCases(subModuleId);
  return {
    status: "success",
    statusCode: 200,
    message: "Allocated test cases retrieved successfully",
    data: testCases.map((t) => ({
      id: t.id,
      testCaseId: t.testcaseNo,
      description: t.description,
      steps: t.detailsSteps || t.steps || "",
      type: t.defectTypeName,
      severity: t.severityName,
    })),
  };
}

export interface BulkAssignOwnerResponse {
  status: string;
  statusCode: number;
  message: string;
  data?: any;
}

export async function bulkAssignOwner(ownerId: number, testCaseIds: number[]): Promise<BulkAssignOwnerResponse> {
  try {
    const res = await apiClient.post("/api/v1/qa-allocation/bulk-assign", {
      ownerId,
      testCaseIds,
    });
    const data = res.data?.data || res.data;
    return {
      status: "success",
      statusCode: 200,
      message: res.data?.message || "Owner assigned successfully",
      data,
    };
  } catch (error) {
    console.warn("Error calling backend bulkAssignOwner API, updating mockDb fallback:", error);
    testCaseIds.forEach((id) => {
      mockDb.updateTestCase(id, { assignedQaId: ownerId });
    });
  }

  return {
    status: "success",
    statusCode: 200,
    message: "Owner assigned successfully",
    data: { ownerId, testCaseIds },
  };
}
