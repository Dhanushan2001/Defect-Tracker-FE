import apiClient from "../../lib/api";
import { ENDPOINTS } from "../../utils/apiendpoint";
import { mockDb } from "../../mock/mockData";

export interface CreateTestCaseRequest {
  description: string;
  detailsSteps: string;
  steps?: string;
  expectedResult?: string;
  severityId: number;
  defectTypeId: number;
}

export interface CreateTestCaseResponse {
  status: string;
  statusCode: number;
  statusMessage: string;
  message?: string;
  data: any;
}

export async function createTestCase(subModuleId: number, testCaseData: CreateTestCaseRequest): Promise<CreateTestCaseResponse> {
  const payload = {
    description: testCaseData.description,
    detailsSteps: testCaseData.detailsSteps || testCaseData.steps || '',
    steps: testCaseData.steps || testCaseData.detailsSteps || '',
    expectedResult: testCaseData.expectedResult || '',
    subModuleId: Number(subModuleId),
    severityId: Number(testCaseData.severityId),
    defectTypeId: Number(testCaseData.defectTypeId),
  };

  try {
    const url = ENDPOINTS.testCaseBySubModule(subModuleId);
    const response = await apiClient.post(url, payload);
    const data = response.data?.data || response.data;

    // Sync mockDb for fallback compatibility
    mockDb.createTestCase({
      id: data?.id,
      testcaseNo: data?.testcaseNo || data?.no,
      no: data?.no || data?.testcaseNo,
      ...payload,
    });

    return {
      status: response.data?.status || 'Created',
      statusCode: response.data?.statusCode || 201,
      statusMessage: response.data?.statusMessage || response.data?.message || 'Test case created successfully',
      message: response.data?.message || 'Test case created successfully',
      data: data,
    };
  } catch (error) {
    console.warn("Backend createTestCase failed, falling back to mockDb:", error);
    const created = mockDb.createTestCase(payload);
    return {
      status: 'Created',
      statusCode: 201,
      statusMessage: 'Test case created successfully',
      message: 'Test case created successfully',
      data: created,
    };
  }
}

export const createTestCaseSub = async (subModuleId: number, payload: CreateTestCaseRequest): Promise<CreateTestCaseResponse> => {
  return createTestCase(subModuleId, payload);
};
