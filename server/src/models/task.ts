// /models/task.ts

import { ITask, Priority, Status } from './../types/task';
import { Schema, model } from 'mongoose';

const taskSchema = new Schema(
    {
        title: { 
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
        projectId: { 
            type: Schema.Types.ObjectId, 
            ref: 'Project', 
            required: true 
        },
        organizationId: { 
            type: Schema.Types.ObjectId, 
            ref: 'Organization', 
            required: true 
        },
        createdBy: { 
            type: Schema.Types.ObjectId, 
            ref: 'User', 
            required: true 
        },
        assignedTo: [{ 
            type: Schema.Types.ObjectId, 
            ref: 'User',
            required: false
        }],
        status: {
            type: String,
            enum: Object.values(Status),
            default: Status.ToDo,
            required: true
        },
        priority: {
            type: String,
            enum: Object.values(Priority),
            required: true
        },
        dueDate: {
            type: Date,
            required: true
        },
    },
    { timestamps: true},
);

// Custom validation
taskSchema.pre("save", function (next) {
    if (this.isNew) {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // normalize to midnight
  
      if (this.dueDate < today) {
        return next(new Error("Due date cannot be in the past."));
      }
    }
    next();
  });
  

taskSchema.set('toJSON', {
    transform: function (_doc, ret: Record<string, unknown>) {
      if (ret._id && typeof ret._id === 'object' && 'toString' in ret._id) {
        ret.id = (ret._id as { toString(): string }).toString();
      }
  
      delete ret._id;
      delete ret.__v;
    }
});
  

const Task = model<ITask>('Task', taskSchema);

export default Task;