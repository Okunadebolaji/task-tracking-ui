export interface Task {
  id: number;
  module: string;
  description: string;
  references?: string;
  startDate: string;
  endDate: string;
  status: string;
  comment?: string;
  isApproved: boolean;
  approvedByUserId?: number;
  createdByUserId: number;
  createdAt: string;
  source: string;
  isRejected: boolean;
  rejectedByUserId?: number;
  projectId: number;
  statusId: number;          // status now uses Id
  statusName: string;
   teamId?: number;
  teamName?: string;
  companyId: number;
  userStory?: string;

}
