import apiClient from '../../lib/api';
import { mockDb } from '../../mock/mockData';

interface Comment {
  id: number;
  comment: string;
  userId: number | string;
  createdBy?: number | string;
  createdByName?: string;
  userName?: string;
  defectId: number | string;
  attachment?: string | null;
  createdAt: string;
  createdTime?: string;
}

export interface GetCommentsResponse {
  message: string;
  data: Comment[];
  status?: string;
  statusCode?: number;
}

export const getCommentsByDefectId = async (defectId: number | string): Promise<GetCommentsResponse> => {
  try {
    const response = await apiClient.get(`/api/v1/defect/${defectId}/comment`);
    const list = response.data?.data || response.data;
    if (Array.isArray(list)) {
      return {
        status: 'success',
        statusCode: 200,
        message: 'Comments fetched successfully',
        data: list.map((c: any) => ({
          id: c.id,
          comment: c.comment,
          userId: c.userId || c.createdBy,
          createdBy: c.createdBy || c.userId,
          createdByName: c.createdByName || c.userName || `User ${c.userId || c.createdBy}`,
          userName: c.userName || c.createdByName || `User ${c.userId || c.createdBy}`,
          defectId: c.defectId,
          attachment: c.attachment || null,
          createdAt: c.createdAt || new Date().toISOString(),
          createdTime: c.createdTime,
        })),
      };
    }
  } catch (err) {
    console.warn("Backend defect comment fetch failed, falling back locally:", err);
  }

  const def = mockDb.getDefectById(Number(defectId));
  const comments = def?.comments || [];

  return {
    status: 'success',
    statusCode: 200,
    message: 'Comments fetched successfully',
    data: comments.map(c => ({
      id: c.id,
      comment: c.comment,
      userId: c.userId,
      createdBy: c.userId,
      createdByName: c.userName || `User ${c.userId}`,
      userName: c.userName || `User ${c.userId}`,
      defectId: c.defectId,
      attachment: null,
      createdAt: c.createdAt,
    })),
  };
};
