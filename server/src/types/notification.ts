// /types/notification.ts

import { Types } from "mongoose";

export interface INotification {
    message: string,
    userId: Types.ObjectId,
    isRead: boolean,
};

export interface ReturnedINotification {
    _id?: Types.ObjectId, // operand of 'delete' operator must be optional
    __v?: number,
    id?: string,
    message: string,
    userId: Types.ObjectId,
    isRead: boolean,
    createdAt?: Date;
};