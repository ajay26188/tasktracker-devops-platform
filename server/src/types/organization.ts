// /types/organization.ts

import {Types} from 'mongoose';

export interface IOrganization {
    name: string
};

export interface ReturnedIOrganization {
    _id?: Types.ObjectId, // operand of 'delete' operator must be optional
    __v?: number,
    id?: string,
    name: string,
    createdAt?: Date;
    updatedAt?: Date;
};