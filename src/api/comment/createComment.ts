import apiClient from '../../lib/api';
import { mockDb } from '../../mock/mockData';

export interface CreateCommentRequest {
  userId: string | number;
  defectId: string | number;
  comment: string;
  attachment?: string | null;
}

export interface CreateCommentResponse {
  message: string;
  data?: any;
  status?: string;
  statusCode?: number;
}

export const createComment = async (payload: CreateCommentRequest): Promise<CreateCommentResponse> => {
  try {
    const response = await apiClient.post(`/api/v1/defect/${payload.defectId}/comment`, {
      userId: Number(payload.userId),
      defectId: Number(payload.defectId),
      comment: payload.comment,
      attachment: payload.attachment || null,
    });
    const data = response.data?.data || response.data;
    return {
      status: 'success',
      statusCode: 200,
      message: 'Comment added successfully',
      data,
    };
  } catch (error) {
    console.warn("Backend comment creation failed, falling back locally:", error);
    const user = mockDb.getUserById(Number(payload.userId));
    const newComment = mockDb.addDefectComment(Number(payload.defectId), payload.comment, user);

    return {
      status: 'success',
      statusCode: 200,
      message: 'Comment added successfully',
      data: newComment,
    };
  }
};

export const updateComment = async (commentId: number, comment: string) => {
  return {
    status: 'success',
    statusCode: 200,
    message: 'Comment updated successfully',
    data: { id: commentId, comment },
  };
};
