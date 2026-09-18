import apiClient from "../../lib/api";
import { mockDb } from "../../mock/mockData";

export interface DefectHistoryEntry {
  id: number;
  defectId: number;
  assignedByName: string;
  assignedToName: string;
  previousStatus: string;
  defectStatus: string;
  name: string;
  defectDate: string;
  defectTime: string;
  createdBy: string;
  updatedBy: string;
}

export async function getDefectHistoryByDefectId(
  defectId: string | number
): Promise<DefectHistoryEntry[]> {
  try {
    const response = await apiClient.get(`/api/v1/defect/${defectId}/history`);
    const list = response.data?.data || response.data;
    if (Array.isArray(list)) {
      return list.map((h: any, idx: number) => ({
        id: h.id || idx + 1,
        defectId: Number(defectId),
        assignedByName: h.assignedByName || '-',
        assignedToName: h.assignedToName || '-',
        previousStatus: h.previousStatus || '-',
        defectStatus: h.defectStatus || '-',
        name: h.name || 'Defect updated',
        defectDate: h.defectDate || (h.createdAt ? h.createdAt.split('T')[0] : new Date().toISOString().split('T')[0]),
        defectTime: h.defectTime || (h.createdAt ? h.createdAt.split('T')[1]?.substring(0, 5) : '12:00'),
        createdBy: h.createdBy || 'QA Tester',
        updatedBy: h.updatedBy || 'QA Tester',
      }));
    }
  } catch (err) {
    console.warn("Backend defect history fetch failed, falling back locally:", err);
  }

  const def = mockDb.getDefectById(Number(defectId));
  if (!def || !def.defectHistory) return [];

  return def.defectHistory.map((h, idx) => ({
    id: h.id || idx + 1,
    defectId: Number(defectId),
    assignedByName: def.assignedByName || 'QA Tester',
    assignedToName: def.assignedToName || '-',
    previousStatus: idx === 0 ? 'New' : def.defectHistory![idx - 1].status,
    defectStatus: h.status,
    name: h.comment || `Status updated to ${h.status}`,
    defectDate: h.changedAt ? h.changedAt.split('T')[0] : new Date().toISOString().split('T')[0],
    defectTime: h.changedAt && h.changedAt.includes('T') ? h.changedAt.split('T')[1]?.substring(0, 5) : '12:00',
    createdBy: h.changedBy || 'QA Tester',
    updatedBy: h.changedBy || 'QA Tester',
  }));
}

export const getDefectHistory = getDefectHistoryByDefectId;
