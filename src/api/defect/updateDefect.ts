import apiClient from "../../lib/api";
import { mockDb } from "../../mock/mockData";

export const updateDefectById = async (
  defectId: string | number,
  payload: FormData | any
) => {
  let defectData: any = {};

  if (payload instanceof FormData) {
    const dataVal = payload.get("data");
    if (dataVal) {
      if (typeof dataVal === "string") {
        try {
          defectData = JSON.parse(dataVal);
        } catch (e) {}
      } else if (dataVal instanceof Blob) {
        try {
          const text = await dataVal.text();
          defectData = JSON.parse(text);
        } catch (e) {}
      }
    }

    payload.forEach((val, key) => {
      if (key !== "data" && key !== "attachmentFile") {
        if (!defectData[key]) defectData[key] = val;
      }
    });
  } else {
    defectData = payload;
  }

  try {
    const response = await apiClient.put(`/api/v1/defect/${defectId}`, {
      title: defectData.description || defectData.title || undefined,
      description: defectData.description || defectData.title || undefined,
      steps: defectData.stepsToRecreation || defectData.steps || undefined,
      moduleId: defectData.moduleId ? Number(defectData.moduleId) : undefined,
      subModuleId: defectData.subModuleId ? Number(defectData.subModuleId) : undefined,
      severityId: defectData.severityId ? Number(defectData.severityId) : undefined,
      priorityId: defectData.priorityId ? Number(defectData.priorityId) : undefined,
      statusId: defectData.statusId ? Number(defectData.statusId) : undefined,
      defectTypeId: defectData.defectTypeId ? Number(defectData.defectTypeId) : (defectData.typeId ? Number(defectData.typeId) : undefined),
      releaseId: defectData.releaseId ? Number(defectData.releaseId) : undefined,
      assignedTo: defectData.assignedTo ? Number(defectData.assignedTo) : (defectData.assigntoId ? Number(defectData.assigntoId) : undefined),
      testCaseId: defectData.testCaseId ? Number(defectData.testCaseId) : undefined,
    });

    const data = response.data?.data || response.data;
    return {
      status: "Success",
      statusCode: 200,
      message: "Defect updated successfully",
      data: {
        status: "Success",
        statusCode: 200,
        message: "Defect updated successfully",
        data,
      },
    };
  } catch (error) {
    console.warn("Backend defect update failed, falling back locally:", error);
    const updated = mockDb.updateDefect(Number(defectId), {
      title: defectData.description || defectData.title,
      description: defectData.description || defectData.title,
      status: defectData.status || defectData.defectStatusName,
      severityId: defectData.severityId ? Number(defectData.severityId) : undefined,
      priorityId: defectData.priorityId ? Number(defectData.priorityId) : undefined,
      assignedToId: defectData.assignedTo ? Number(defectData.assignedTo) : undefined,
      steps: defectData.stepsToRecreation || defectData.steps,
    });

    return {
      status: "Success",
      statusCode: 200,
      message: "Defect updated successfully",
      data: {
        status: "Success",
        statusCode: 200,
        message: "Defect updated successfully",
        data: updated,
      },
    };
  }
};