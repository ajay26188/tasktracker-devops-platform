export interface Notification {
    id?: string,
    message: string,
    userId: string
    isRead: boolean,
    createdAt?: string
};

export interface PaginatedNotifications {
    notifications: Notification[];
    total: number;
    page: number;
    pages: number;
  }