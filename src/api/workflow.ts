import apiClient from "../lib/api";
import { ENDPOINTS } from "../utils/apiendpoint";

interface WorkflowNodeRequest {
  id: number;
  positionX: number;
  positionY: number;
}

interface WorkflowConnectionRequest {
  fromStatusId: number;
  toStatusId: number;
}

export interface SaveWorkflowRequest {
  nodes: WorkflowNodeRequest[];
  connections: WorkflowConnectionRequest[];
}

export interface SaveWorkflowResponse {
  status: string;
  statusMessage: string;
  data?: any;
  statusCode: number;
}

export interface StatusInfo {
  id: number;
  name: string;
  statusName?: string;
  color: string;
  colorCode?: string;
  type?: string;
  statusType?: string;
  positionX?: number;
  positionY?: number;
}

export interface WorkflowTransitionResponse {
  id: number;
  fromStatus: StatusInfo;
  toStatus: StatusInfo;
}

export interface GetAllWorkflowsResponse {
  status: string;
  statusMessage: string;
  data: WorkflowTransitionResponse[];
  statusCode: number;
}

export interface NextStatusResponse {
  status: string;
  statusMessage: string;
  data: StatusInfo[];
  statusCode: number;
}

export const getAllWorkflows = async (): Promise<GetAllWorkflowsResponse> => {
  const response = await apiClient.get(ENDPOINTS.workflow);
  const data = response.data;
  return {
    status: data.status || "success",
    statusMessage: data.statusMessage || data.message || "Workflows fetched successfully",
    statusCode: data.statusCode || 200,
    data: Array.isArray(data.data) ? data.data : [],
  };
};

export const saveWorkflow = async (
  workflowData: SaveWorkflowRequest
): Promise<SaveWorkflowResponse> => {
  const response = await apiClient.post(ENDPOINTS.workflow, workflowData);
  const data = response.data;
  return {
    status: data.status || "success",
    statusMessage: data.statusMessage || data.message || "Workflow saved successfully",
    statusCode: data.statusCode || 200,
    data: data.data,
  };
};

export const getNextStatuses = async (
  fromStatusId: number
): Promise<NextStatusResponse> => {
  const response = await apiClient.get(ENDPOINTS.workflowNextStatus(fromStatusId));
  const data = response.data;
  return {
    status: data.status || "success",
    statusMessage: data.statusMessage || data.message || "Next statuses fetched",
    statusCode: data.statusCode || 200,
    data: Array.isArray(data.data) ? data.data : [],
  };
};
