
export interface Comment {
    id: string,
    comment: string,
    taskId: string,
    userId?: string | { _id: string; name: string },
    organizationId?: string,
    createdAt?: string;
};