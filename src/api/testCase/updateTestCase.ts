import apiClient from "../../lib/api";
import { ENDPOINTS } from "../../utils/apiendpoint";
import { mockDb } from "../../mock/mockData";

export async function updateTestCase(
  subModuleId: number,
  testCaseId: string | number,
  data: any
) {
  const payload = {
    description: data.description,
    detailsSteps: data.detailsSteps || data.steps || '',
    steps: data.steps || data.detailsSteps || '',
    expectedResult: data.expectedResult || '',
    severityId: data.severityId ? Number(data.severityId) : undefined,
    defectTypeId: data.defectTypeId ? Number(data.defectTypeId) : undefined,
    subModuleId: subModuleId ? Number(subModuleId) : undefined,
    testcaseNo: data.testcaseNo || data.no,
  };

  try {
    const url = ENDPOINTS.testCaseById(subModuleId, Number(testCaseId));
    const response = await apiClient.put(url, payload);
    const updated = response.data?.data || response.data;

    // Sync mockDb for fallback
    mockDb.updateTestCase(Number(testCaseId), payload);

    return {
      status: response.data?.status || 'success',
      statusCode: response.data?.statusCode || 200,
      message: response.data?.message || 'Test case updated successfully',
      data: updated,
    };
  } catch (error) {
    console.warn("Backend updateTestCase failed, falling back to mockDb:", error);
    const updated = mockDb.updateTestCase(Number(testCaseId), payload);
    return {
      status: 'success',
      statusCode: 200,
      message: 'Test case updated successfully',
      data: updated,
    };
  }
}
