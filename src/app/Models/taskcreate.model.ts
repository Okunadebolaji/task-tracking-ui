export interface TaskCreate {
  module: string;
  description: string;
  references?: string;
  startDate: string;
  endDate: string;    
  status: string;
  comment?: string;
  projectId: number;
  source: string;
  
}
