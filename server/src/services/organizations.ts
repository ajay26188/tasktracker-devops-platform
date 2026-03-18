// /services/organizations.ts

import Organization from "../models/organization";
import Project from "../models/project";
import User from "../models/user";
import { IOrganization } from "../types/organization";
import { IUser } from "../types/user";
import { Document, Types } from "mongoose";

export const getOrganization = async(id: string, authnticatedUser: (IUser & Document)) => {
    if (authnticatedUser.organizationId.toString() !== id) {
        return 'unauthorized';
    }

    const org = await Organization.findById(id);

    if (!org) return null;

    return org;
};

export const addOrganization = async(data: IOrganization) => {
    return await Organization.create(data);
};

export const removeOrganization = async (id: string, user: IUser & Document) => {
    if (user.organizationId.toString() !== id) return 'unauthorized';

    const organization = await Organization.findById(id);
    if (!organization) return null;

    //Deleting organization and their users & projects parallely
    await Promise.all([
        organization.deleteOne(),
        User.deleteMany({ organizationId: new Types.ObjectId(id) }),
        Project.deleteMany({ organizationId: new Types.ObjectId(id) }),
    ]);

    return 'deleted';
};


export const updateOrganization = async (orgId: string, updates: IOrganization, user: (IUser & Document)) => {
    if (orgId !== user.organizationId.toString()) return 'unauthorized';

    const { name } = updates;

    const org = await Organization.findById(orgId);

    if (!org) return null;
  
    if (name) org.name = name;
  
    return await org.save();
};