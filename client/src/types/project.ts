import type { Task } from "./task";

export interface Project {
    id: string;            
    name: string;
    description: string;
    organizationId: string;
    startDate: string;
    endDate: string;
    tasks?: (string | Task)[];
    createdBy: string | { name: string; email: string } | null;
    createdAt?: string;
    updatedAt?: string;
}

  