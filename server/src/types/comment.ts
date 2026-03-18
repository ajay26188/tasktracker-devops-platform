// /types/comment.ts

import { Types } from "mongoose";

export interface IComment {
    comment: string,
    taskId: Types.ObjectId,
    userId: Types.ObjectId,
    organizationId: Types.ObjectId
};

export interface ReturnedIComment {
    _id?: Types.ObjectId, // operand of 'delete' operator must be optional
    __v?: number,
    id?: string,
    comment: string,
    taskId: Types.ObjectId,
    userId: Types.ObjectId,
    organizationId: Types.ObjectId
    createdAt?: Date;
};

export type newCommentData = Omit<IComment, 'userId' | 'orgId'>;