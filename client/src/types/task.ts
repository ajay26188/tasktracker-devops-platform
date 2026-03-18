import type { Project } from "./project";
import type { User } from "./user";


export type  TaskStatus = "todo" | "in-progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;            
  title: string;           
  description?: string;   
  status: TaskStatus;    
  priority?: TaskPriority;
  dueDate?: string;
  organizationId: string,     
  assignedTo?: User[];  
  projectId: Project; 
  createdAt?: string;
  updatedAt?: string;
}

export interface TaskPayload {
  id?: string;            
  title: string;           
  description?: string;   
  status: TaskStatus;    
  priority?: TaskPriority;
  dueDate?: string;
  organizationId: string,     
  assignedTo?: string[];  
  projectId: string; 
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedTasks {
  tasks: Task[];
  total: number;
  page: number;
  pages: number;
}

//for kanban board view
export interface groupedTasks {
  todo: Task[],
  "in-progress": Task[],
  done: Task[]
}

