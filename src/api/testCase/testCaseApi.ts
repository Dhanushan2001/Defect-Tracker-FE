import apiClient from "../../lib/api";
import { ENDPOINTS } from "../../utils/apiendpoint";
import { mockDb } from "../../mock/mockData";

export const getTestCasesByProjectAndSubmodule = async (
  _projectId: string,
  subModuleId: string,
  description?: string,
  defectTypeId?: number,
  severityId?: number,
  page?: number,
  size: number = 1000000
): Promise<any[]> => {
  try {
    const url = ENDPOINTS.testCaseBySubModule(
      Number(subModuleId),
      description,
      defectTypeId,
      severityId,
      page,
      size
    );
    const response = await apiClient.get(url);
    const rawData = response.data?.data || response.data || [];
    const list = Array.isArray(rawData) ? rawData : Array.isArray(rawData?.content) ? rawData.content : [];

    const mapped = list.map((t: any) => ({
      id: t.id,
      no: t.no || t.testcaseNo || `TC-${t.id}`,
      testcaseNo: t.testcaseNo || t.no || `TC-${t.id}`,
      testCaseId: t.id,
      description: t.description || '',
      detailsSteps: t.detailsSteps || t.steps || '',
      steps: t.steps || t.detailsSteps || '',
      expectedResult: t.expectedResult || '',
      subModuleId: t.subModuleId ? Number(t.subModuleId) : Number(subModuleId),
      subModuleName: t.subModuleName || '',
      subModule: t.subModuleName || '',
      moduleId: t.moduleId,
      moduleName: t.moduleName || '',
      module: t.moduleName || '',
      projectId: t.projectId,
      projectName: t.projectName || '',
      severityId: t.severityId,
      severityName: t.severityName || 'Medium',
      severity: t.severityName || 'Medium',
      defectTypeId: t.defectTypeId,
      defectTypeName: t.defectTypeName || 'Functional Bug',
      type: t.defectTypeName || 'Functional Bug',
      executionStatus: t.executionStatus || 'NOT_RUN',
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
      createdBy: t.createdBy,
      updatedBy: t.updatedBy,
    }));

    (mapped as any).totalPages = response.data?.data?.totalPages || 1;
    (mapped as any).totalElements = response.data?.data?.totalElements || mapped.length;
    (mapped as any).isServerPaginated = false;
    return mapped;
  } catch (error) {
    console.warn("Backend getTestCasesByProjectAndSubmodule failed, falling back to mockDb:", error);
    const testCases = mockDb.getTestCases(Number(subModuleId));
    let filtered = testCases;
    if (description) {
      const term = description.toLowerCase();
      filtered = filtered.filter(t => (t.description || '').toLowerCase().includes(term));
    }
    if (defectTypeId) {
      filtered = filtered.filter(t => t.defectTypeId === Number(defectTypeId));
    }
    if (severityId) {
      filtered = filtered.filter(t => t.severityId === Number(severityId));
    }
    const list = filtered.map(t => ({
      id: t.id,
      no: t.testcaseNo,
      testcaseNo: t.testcaseNo,
      testCaseId: t.id,
      description: t.description,
      detailsSteps: t.detailsSteps || t.steps,
      steps: t.steps || t.detailsSteps,
      expectedResult: t.expectedResult,
      subModuleId: t.subModuleId,
      subModuleName: t.subModuleName,
      subModule: t.subModuleName,
      moduleId: t.moduleId,
      moduleName: t.moduleName,
      module: t.moduleName,
      severityId: t.severityId,
      severityName: t.severityName,
      severity: t.severityName,
      defectTypeId: t.defectTypeId,
      defectTypeName: t.defectTypeName,
      type: t.defectTypeName,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
      createdBy: t.createdBy,
      updatedBy: t.updatedBy,
    }));

    (list as any).totalPages = 1;
    (list as any).totalElements = list.length;
    (list as any).isServerPaginated = false;
    return list;
  }
};

export async function deleteTestCase(
  subModuleId: number,
  testCaseId: string | number
) {
  try {
    const url = ENDPOINTS.testCaseById(subModuleId, Number(testCaseId));
    const response = await apiClient.delete(url);
    mockDb.deleteTestCase(Number(testCaseId));
    return {
      status: response.data?.status || 'success',
      statusCode: response.data?.statusCode || 200,
      message: response.data?.message || 'Test case deleted successfully',
    };
  } catch (error) {
    console.warn("Backend deleteTestCase failed, falling back to mockDb:", error);
    mockDb.deleteTestCase(Number(testCaseId));
    return {
      status: 'success',
      statusCode: 200,
      message: 'Test case deleted successfully',
    };
  }
}

export async function getTestCasesByProjectAndModule(
  projectId: string | number,
  moduleId: string | number,
  _page: number = 0,
  _size: number = 1000000
) {
  try {
    const response = await apiClient.get(`/api/v1/module/${moduleId}/test-case`);
    const rawData = response.data?.data || response.data || [];
    const list = Array.isArray(rawData) ? rawData : Array.isArray(rawData?.content) ? rawData.content : [];

    const mapped = list.map((t: any) => ({
      id: t.id,
      no: t.no || t.testcaseNo || `TC-${t.id}`,
      testcaseNo: t.testcaseNo || t.no || `TC-${t.id}`,
      testCaseId: t.id,
      description: t.description || '',
      detailsSteps: t.detailsSteps || t.steps || '',
      steps: t.steps || t.detailsSteps || '',
      expectedResult: t.expectedResult || '',
      subModuleId: t.subModuleId,
      subModuleName: t.subModuleName || '',
      subModule: t.subModuleName || '',
      moduleId: t.moduleId ? Number(t.moduleId) : Number(moduleId),
      moduleName: t.moduleName || '',
      module: t.moduleName || '',
      projectId: t.projectId ? Number(t.projectId) : Number(projectId),
      projectName: t.projectName || '',
      severityId: t.severityId,
      severityName: t.severityName || 'Medium',
      severity: t.severityName || 'Medium',
      defectTypeId: t.defectTypeId,
      defectTypeName: t.defectTypeName || 'Functional Bug',
      type: t.defectTypeName || 'Functional Bug',
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    }));

    (mapped as any).totalPages = response.data?.data?.totalPages || 1;
    (mapped as any).totalElements = response.data?.data?.totalElements || mapped.length;
    (mapped as any).isServerPaginated = false;
    return mapped;
  } catch (error) {
    console.warn("Backend getTestCasesByProjectAndModule failed, falling back to mockDb:", error);
    const testCases = mockDb.getTestCases();
    const filtered = testCases.filter(t => t.moduleId === Number(moduleId) || Number(moduleId) === 1);
    const list = filtered.map(t => ({
      id: t.id,
      no: t.testcaseNo,
      testcaseNo: t.testcaseNo,
      testCaseId: t.id,
      description: t.description,
      detailsSteps: t.detailsSteps || t.steps,
      steps: t.steps || t.detailsSteps,
      expectedResult: t.expectedResult,
      subModuleId: t.subModuleId,
      subModuleName: t.subModuleName,
      subModule: t.subModuleName,
      moduleId: t.moduleId,
      moduleName: t.moduleName,
      module: t.moduleName,
      severityId: t.severityId,
      severityName: t.severityName,
      severity: t.severityName,
      defectTypeId: t.defectTypeId,
      defectTypeName: t.defectTypeName,
      type: t.defectTypeName,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    }));

    (list as any).totalPages = 1;
    (list as any).totalElements = list.length;
    (list as any).isServerPaginated = false;
    return list;
  }
}

export async function getTestCasesByProject(projectId: string | number) {
  try {
    const response = await apiClient.get(`/api/v1/project/${projectId}/test-case`);
    const rawData = response.data?.data || response.data || [];
    const list = Array.isArray(rawData) ? rawData : Array.isArray(rawData?.content) ? rawData.content : [];
    return list.map((t: any) => ({
      id: t.id,
      no: t.no || t.testcaseNo || `TC-${t.id}`,
      testcaseNo: t.testcaseNo || t.no || `TC-${t.id}`,
      testCaseId: t.id,
      description: t.description || '',
      detailsSteps: t.detailsSteps || t.steps || '',
      steps: t.steps || t.detailsSteps || '',
      expectedResult: t.expectedResult || '',
      subModuleId: t.subModuleId,
      subModuleName: t.subModuleName || '',
      subModule: t.subModuleName || '',
      moduleId: t.moduleId,
      moduleName: t.moduleName || '',
      module: t.moduleName || '',
      projectId: t.projectId ? Number(t.projectId) : Number(projectId),
      projectName: t.projectName || '',
      severityId: t.severityId,
      severityName: t.severityName || 'Medium',
      severity: t.severityName || 'Medium',
      defectTypeId: t.defectTypeId,
      defectTypeName: t.defectTypeName || 'Functional Bug',
      type: t.defectTypeName || 'Functional Bug',
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    }));
  } catch (error) {
    console.warn("Backend getTestCasesByProject failed, falling back to mockDb:", error);
    const testCases = mockDb.getTestCases();
    return testCases.map(t => ({
      id: t.id,
      no: t.testcaseNo,
      testcaseNo: t.testcaseNo,
      testCaseId: t.id,
      description: t.description,
      detailsSteps: t.detailsSteps || t.steps,
      steps: t.steps || t.detailsSteps,
      expectedResult: t.expectedResult,
      subModuleId: t.subModuleId,
      subModuleName: t.subModuleName,
      subModule: t.subModuleName,
      moduleId: t.moduleId,
      moduleName: t.moduleName,
      module: t.moduleName,
      severityId: t.severityId,
      severityName: t.severityName,
      severity: t.severityName,
      defectTypeId: t.defectTypeId,
      defectTypeName: t.defectTypeName,
      type: t.defectTypeName,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    }));
  }
}

export async function getTestCasesByBulkModules(
  projectId: string | number,
  moduleIds: number[]
) {
  const all: any[] = [];
  for (const modId of moduleIds) {
    const list = await getTestCasesByProjectAndModule(projectId, modId);
    all.push(...list);
  }
  return all;
}

export async function getTestCasesByBulkSubmodules(
  projectId: string | number,
  submoduleIds: number[]
) {
  const all: any[] = [];
  for (const subId of submoduleIds) {
    const list = await getTestCasesByProjectAndSubmodule(String(projectId), String(subId));
    all.push(...list);
  }
  return all;
}
