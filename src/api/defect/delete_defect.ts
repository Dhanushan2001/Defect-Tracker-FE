import apiClient from "../../lib/api";
import { mockDb } from "../../mock/mockData";

export const deleteDefectById = async (id: string | number) => {
  try {
    await apiClient.delete(`/api/v1/defect/${id}`);
  } catch (err) {
    console.warn("Backend defect deletion failed, falling back locally:", err);
    mockDb.deleteDefect(Number(id));
  }

  return {
    status: 'Success',
    statusCode: 2000,
    message: 'Defect deleted successfully',
  };
};

export const deleteDefect = deleteDefectById;