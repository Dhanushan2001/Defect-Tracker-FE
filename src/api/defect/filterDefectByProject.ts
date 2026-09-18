import apiClient from "../../lib/api";
import { FilteredDefect } from "../../types";
import { mockDb } from "../../mock/mockData";

export async function getDefectsByProjectId(
  projectId: number,
  page: number = 0,
  size: number = 10,
  search?: string
): Promise<any> {
  let defects: any[] = [];

  try {
    const response = await apiClient.get(`/api/v1/project/${projectId}/defect`);
    const raw = response.data?.data || response.data;
    if (Array.isArray(raw)) {
      defects = raw;
    }
  } catch (err) {
    console.warn("Backend defect fetch failed, falling back to local store:", err);
    defects = mockDb.getDefects(projectId);
  }

  if (search && search.trim()) {
    const term = search.toLowerCase().trim();
    defects = defects.filter((d: any) =>
      (d.title && d.title.toLowerCase().includes(term)) ||
      (d.description && d.description.toLowerCase().includes(term)) ||
      (d.defectNo && d.defectNo.toLowerCase().includes(term)) ||
      (d.defectId && String(d.defectId).toLowerCase().includes(term))
    );
  }

  const start = page * size;
  const paged = defects.slice(start, start + size);

  const mapped = paged.map((d: any) => ({
    id: d.id,
    defectId: d.defectNo || d.defectId || `DEF-${d.id}`,
    defectNo: d.defectNo || d.defectId || `DEF-${d.id}`,
    description: d.description || d.title || "",
    title: d.title || d.description || "",
    reOpenCount: d.reOpenCount || 0,
    attachment: d.attachment || null,
    steps: d.steps || d.stepsToRecreation || "",
    stepsToRecreation: d.stepsToRecreation || d.steps || "",
    projectId: d.projectId,
    projectName: d.projectName,
    project_name: d.projectName,
    moduleId: d.moduleId,
    moduleName: d.moduleName,
    module_name: d.moduleName,
    subModuleId: d.subModuleId || d.submoduleId,
    sub_module_id: d.subModuleId || d.submoduleId,
    subModuleName: d.subModuleName,
    sub_module_name: d.subModuleName,
    severityId: d.severityId,
    severity_id: d.severityId,
    severityName: d.severityName || d.severity || 'Medium',
    severity_name: d.severityName || d.severity || 'Medium',
    priorityId: d.priorityId,
    priority_id: d.priorityId,
    priorityName: d.priorityName || d.priority || 'Medium',
    priority_name: d.priorityName || d.priority || 'Medium',
    statusId: d.statusId,
    status_id: d.statusId,
    statusName: d.statusName || d.status || 'New',
    status: d.statusName || d.status || 'New',
    defect_status_name: d.statusName || d.status || 'New',
    defect_status_id: d.statusId || 1,
    releaseId: d.releaseId,
    release_id: d.releaseId,
    releaseName: d.releaseName,
    release_name: d.releaseName,
    assignedTo: d.assignedTo || d.assignedToId,
    assignedToId: d.assignedToId || d.assignedTo,
    assigned_to_id: d.assignedToId || d.assignedTo,
    assignedToName: d.assignedToName || d.executerDefect || '-',
    assigned_to_name: d.assignedToName || d.executerDefect || '-',
    assignedById: d.reportedById || d.reportedBy || d.assignedById,
    assigned_by_id: d.reportedById || d.reportedBy || d.assignedById,
    assignedByName: d.reportedByName || d.assignedByName || '-',
    assigned_by_name: d.reportedByName || d.assignedByName || '-',
    createdByName: d.reportedByName || d.assignedByName || '-',
    defectTypeId: d.defectTypeId || d.typeId,
    defect_type_id: d.defectTypeId || d.typeId,
    defectTypeName: d.defectTypeName || d.type || 'Functional Bug',
    defect_type_name: d.defectTypeName || d.type || 'Functional Bug',
    type: d.defectTypeName || d.type || 'Functional Bug',
    testCaseId: d.testCaseId,
    testCaseNo: d.testCaseNo,
    commentsCount: d.commentsCount ?? d.commentCount ?? 0,
    commentCount: d.commentCount ?? d.commentsCount ?? 0,
    createdAt: d.createdAt,
    updatedAt: d.updatedAt,
  }));

  return {
    status: 'success',
    statusCode: 200,
    data: {
      content: mapped,
      totalElements: defects.length,
      totalPages: Math.max(1, Math.ceil(defects.length / size)),
      size,
      number: page,
    },
    content: mapped,
    totalPages: Math.max(1, Math.ceil(defects.length / size)),
    totalElements: defects.length,
  };
}

export async function filterDefects(
  filters: any,
  page: number = 0,
  size: number = 10
): Promise<any> {
  const projectId = Number(filters.projectId || 1);
  return getDefectsByProjectId(projectId, page, size, filters.search);
}

export async function filterDefectsForTest(filters: {
  projectId: string | number;
  releaseId?: number;
}): Promise<FilteredDefect[]> {
  const projectId = Number(filters.projectId);
  const result = await getDefectsByProjectId(projectId, 0, 1000);
  let content = result.content || [];
  if (filters.releaseId) {
    content = content.filter((d: any) => Number(d.releaseId) === Number(filters.releaseId));
  }
  return content;
}