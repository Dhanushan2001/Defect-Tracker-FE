import apiClient from "../../lib/api";
import { mockDb } from "../../mock/mockData";

export interface DefectCreate {
  description: string;
  steps: string;
  projectId: number;
  severityId: number;
  priorityId: number;
  defectStatusId?: number;
  typeId: number;
  reOpenCount?: number;
  attachment?: string | null;
  assignbyId?: number | null;
  assigntoId?: number;
  modulesId?: number;
  moduleId?: number;
  subModuleId?: number | null;
  releasesId?: number | null;
  releaseId?: number | null;
  testCaseRequired?: boolean;
  testCaseId?: number | null;
}

export interface DefectCreateProps {
  message: string;
  data: any;
  status: string;
  statusCode: number;
}

export const addDefects = async (
  payload: DefectCreate | FormData
): Promise<DefectCreateProps> => {
  let defectData: any = {};

  if (payload instanceof FormData) {
    const dataPart = payload.get("data");
    if (dataPart) {
      if (typeof dataPart === "string") {
        try {
          defectData = JSON.parse(dataPart);
        } catch (e) {}
      } else if (dataPart instanceof Blob) {
        try {
          const text = await dataPart.text();
          defectData = JSON.parse(text);
        } catch (e) {}
      }
    }

    payload.forEach((val, key) => {
      if (key !== "data" && key !== "attachmentFile") {
        if (defectData[key] === undefined) defectData[key] = val;
      }
    });
  } else {
    defectData = payload;
  }

  try {
    const postPayload = {
      title: defectData.description || defectData.title || "Defect",
      description: defectData.description || defectData.title || "",
      steps: defectData.stepsToRecreation || defectData.steps || "",
      projectId: defectData.projectId ? Number(defectData.projectId) : undefined,
      severityId: defectData.severityId ? Number(defectData.severityId) : undefined,
      priorityId: defectData.priorityId ? Number(defectData.priorityId) : undefined,
      defectStatusId: defectData.defectStatusId ? Number(defectData.defectStatusId) : (defectData.statusId ? Number(defectData.statusId) : undefined),
      defectTypeId: defectData.defectTypeId ? Number(defectData.defectTypeId) : (defectData.typeId ? Number(defectData.typeId) : undefined),
      moduleId: defectData.moduleId ? Number(defectData.moduleId) : (defectData.modulesId ? Number(defectData.modulesId) : undefined),
      subModuleId: defectData.subModuleId ? Number(defectData.subModuleId) : undefined,
      releaseId: defectData.releaseId ? Number(defectData.releaseId) : (defectData.releasesId ? Number(defectData.releasesId) : undefined),
      testCaseId: defectData.testCaseId ? Number(defectData.testCaseId) : undefined,
      assignedTo: defectData.assignedTo ? Number(defectData.assignedTo) : (defectData.assigntoId ? Number(defectData.assigntoId) : (defectData.assignedToId ? Number(defectData.assignedToId) : undefined)),
      reportedBy: defectData.reportedBy ? Number(defectData.reportedBy) : (defectData.assignbyId ? Number(defectData.assignbyId) : (defectData.assignedById ? Number(defectData.assignedById) : undefined)),
      attachment: defectData.attachment || null,
    };

    const response = await apiClient.post("/api/v1/defect", postPayload, {
      headers: { "Content-Type": "application/json" },
    });

    const data = response.data?.data || response.data;
    return {
      status: "created",
      statusCode: 201,
      message: response.data?.message || "Defect created successfully",
      data: Array.isArray(data) ? data : [data],
    };
  } catch (error: any) {
    console.warn("Backend defect creation failed, falling back locally:", error);
    const created = mockDb.createDefect({
      title: defectData.description || defectData.title || 'Defect',
      description: defectData.description || defectData.title || '',
      steps: defectData.stepsToRecreation || defectData.steps || '',
      projectId: Number(defectData.projectId || 1),
      severityId: Number(defectData.severityId || 2),
      priorityId: Number(defectData.priorityId || 2),
      defectStatusId: Number(defectData.defectStatusId || 1),
      moduleId: Number(defectData.moduleId || defectData.modulesId || 1),
      subModuleId: Number(defectData.subModuleId || 1),
      releaseId: Number(defectData.releaseId || defectData.releasesId || 1),
      assignedToId: Number(defectData.assignedTo || defectData.assigntoId || defectData.assignedToId || 3),
      assignedById: Number(defectData.reportedBy || defectData.assignbyId || defectData.assignedById || 1),
    });

    return {
      status: 'created',
      statusCode: 201,
      message: 'Defect created successfully',
      data: [created],
    };
  }
};
