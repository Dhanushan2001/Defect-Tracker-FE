import apiClient from "../../lib/api";
import { mockDb } from "../../mock/mockData";

export async function getTestCasesByFilter({
  projectId,
  releaseId,
  moduleId,
  subModuleId,
}: {
  projectId: number;
  releaseId: number;
  moduleId?: number;
  subModuleId?: number;
}) {
  try {
    const params = new URLSearchParams();
    if (moduleId) params.append("moduleId", String(moduleId));
    if (subModuleId) params.append("subModuleId", String(subModuleId));

    const response = await apiClient.get(
      `/api/v1/release/${releaseId}/test-case${params.toString() ? `?${params.toString()}` : ""}`
    );

    const rawList = response.data?.data || response.data || [];
    const list = Array.isArray(rawList) ? rawList : [];

    return list.map((item: any) => {
      const tcId = item.testcaseId || item.id;
      const tcNo = item.testCaseNo || item.testCaseId || (tcId ? `TC-${String(tcId).padStart(3, "0")}` : `TC-${item.id}`);
      const rawStatus = item.executionStatus || item.status || "NOT_RUN";
      const execStatus = rawStatus.toLowerCase();
      const mappedStatus = execStatus === "pass" ? "passed" : execStatus === "fail" ? "failed" : execStatus;

      return {
        id: tcId,
        backendId: item.id, // allocation ID
        releaseTestCaseId: item.id,
        testcaseNo: tcNo,
        no: tcNo,
        testCaseId: tcNo,
        description: item.description || item.name || "",
        detailsSteps: item.detailsSteps || item.steps || "",
        steps: item.detailsSteps || item.steps || "",
        expectedResult: item.expectedResult || "",
        severityName: item.severityName || item.severity || "medium",
        severity: (item.severityName || item.severity || "medium").toLowerCase(),
        defectTypeName: item.defectTypeName || item.type || "functional",
        type: (item.defectTypeName || item.type || "functional").toLowerCase(),
        subModuleName: item.subModuleName || "",
        subModule: item.subModuleName || "",
        subModuleId: item.subModuleId || item.submoduleId,
        moduleName: item.moduleName || "",
        module: item.moduleName || "",
        moduleId: item.moduleId,
        projectId: item.projectId || projectId,
        releaseId: item.releaseId || releaseId,
        executionStatus: mappedStatus,
        status: mappedStatus,
        defectNo: item.defectNo || null,
        defectId: item.defectNo || (item.defectId ? String(item.defectId) : null),
        assignedDev: item.assignedDevName || item.assignedDev || null,
        assignedDevName: item.assignedDevName || item.assignedDev || null,
        assignedTo: item.assignedDevName || item.assignedDev || null,
        assignedQa: item.assignedQaName || null,
        assignedQaName: item.assignedQaName || null,
      };
    });
  } catch (error) {
    console.warn("Could not fetch test cases from API, using fallback:", error);
    let testCases = mockDb.getTestCases();
    if (subModuleId) {
      testCases = testCases.filter(t => t.subModuleId === subModuleId);
    } else if (moduleId) {
      testCases = testCases.filter(t => t.moduleId === moduleId);
    }

    return testCases.map(t => ({
      id: t.id,
      backendId: t.id,
      testcaseNo: t.testcaseNo,
      no: t.testcaseNo,
      testCaseId: t.testcaseNo,
      description: t.description,
      detailsSteps: t.detailsSteps || t.steps,
      steps: t.detailsSteps || t.steps,
      expectedResult: t.expectedResult,
      severityName: t.severityName,
      severity: (t.severityName || "medium").toLowerCase(),
      defectTypeName: t.defectTypeName,
      type: (t.defectTypeName || "functional").toLowerCase(),
      subModuleName: t.subModuleName,
      subModule: t.subModuleName,
      subModuleId: t.subModuleId,
      moduleName: t.moduleName,
      module: t.moduleName,
      moduleId: t.moduleId,
      projectId,
      releaseId,
      executionStatus: t.executionStatus || 'NOT_RUN',
      status: t.executionStatus || 'NOT_RUN',
    }));
  }
}