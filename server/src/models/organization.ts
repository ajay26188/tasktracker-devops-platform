import { Schema, model } from 'mongoose';
import { IOrganization, ReturnedIOrganization } from '../types/organization';

const organizationSchema = new Schema<IOrganization>(
    {
    name: { type: String, required: true, unique: true },
    },
    {timestamps: true}
);

organizationSchema.set('toJSON', {
    transform: function (
      _doc, ret: ReturnedIOrganization
    ) {
      ret.id = ret._id?.toString();
      delete ret._id;
      delete ret.__v;
    }
});

const Organization = model<IOrganization>('Organization', organizationSchema);

export default Organization;