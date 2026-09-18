import apiClient from "../../lib/api";
import { mockDb } from "../../mock/mockData";

export const searchTestCaseByCriteria = async (
  moduleId?: number,
  description?: string,
  defectTypeId?: number,
  severityId?: number
) => {
  try {
    const params = new URLSearchParams();
    if (moduleId) params.append("moduleId", String(moduleId));
    if (description && description.trim()) params.append("description", description.trim());
    if (defectTypeId) params.append("defectTypeId", String(defectTypeId));
    if (severityId) params.append("severityId", String(severityId));

    const url = `/api/v1/test-case${params.toString() ? `?${params.toString()}` : ""}`;
    const response = await apiClient.get(url);
    const rawData = response.data?.data || response.data || [];
    const list = Array.isArray(rawData) ? rawData : Array.isArray(rawData?.content) ? rawData.content : [];
    return list.map((t: any) => ({
      ...t,
      id: t.id,
      no: t.no || t.testcaseNo || `TC-${t.id}`,
      testcaseNo: t.testcaseNo || t.no || `TC-${t.id}`,
      testCaseId: t.id,
    }));
  } catch (error) {
    console.warn("Backend searchTestCaseByCriteria failed, falling back to mockDb:", error);
    let testCases = mockDb.getTestCases();
    if (moduleId) {
      testCases = testCases.filter(t => t.moduleId === Number(moduleId) || Number(moduleId) === 1);
    }
    if (description) {
      const term = description.toLowerCase();
      testCases = testCases.filter(t => (t.description || '').toLowerCase().includes(term));
    }
    if (defectTypeId) {
      testCases = testCases.filter(t => t.defectTypeId === Number(defectTypeId));
    }
    if (severityId) {
      testCases = testCases.filter(t => t.severityId === Number(severityId));
    }
    return testCases;
  }
};