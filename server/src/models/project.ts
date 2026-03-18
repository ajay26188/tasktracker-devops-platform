import { Schema, model } from 'mongoose';
import { IProject } from '../types/project';

const projectSchema = new Schema(
    {
        name: { 
            type: String, 
            required: true,
            minLength: [2, 'Name must be at least 2 characters long.'],
            maxLength: [100, 'Name must be at most 100 characters long.'],
            trim: true
        },
        description: { 
            type: String, 
            required: true,
            maxLength: [1000, 'Description must be at most 1000 characters long.'],
            trim: true 
        },
        startDate: {
            type: Date,
            required: true
          },
        endDate: {
            type: Date,
            required: true
        },
        tasks: [{ 
            type: Schema.Types.ObjectId, 
            ref: 'Task'
        }],
        organizationId: { 
            type: Schema.Types.ObjectId, ref: 'Organization', 
            required: true 
        },
        createdBy: { 
            type: Schema.Types.ObjectId, ref: 'User', 
            required: true }
    },
    { timestamps: true},
);

// Custom validation
projectSchema.pre("save", function (next) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize to midnight so only date matters
  
    // Only enforce future startDate if this is a NEW document
    if (this.isNew && this.startDate < today) {
        return next(new Error("Start date cannot be in the past."));
    }
  
    if (this.endDate < today) {
      return next(new Error("End date cannot be in the past."));
    }
  
    if (this.endDate < this.startDate) {
      return next(new Error("End date cannot be before start date."));
    }
  
    next();
});
  

projectSchema.set('toJSON', {
    transform: function (_doc, ret: Record<string, unknown>) {
      if (ret._id && typeof ret._id === 'object' && 'toString' in ret._id) {
        ret.id = (ret._id as { toString(): string }).toString();
      }
  
      delete ret._id;
      delete ret.__v;
    }
});
  

const Project = model<IProject>('Project', projectSchema);

export default Project;