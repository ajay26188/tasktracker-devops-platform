// /models/comment.ts

import { Schema, model } from 'mongoose';
import { IComment } from '../types/comment';

const commentSchema = new Schema(
    {
        comment: { 
            type: String, 
            required: true,
            minLength: [2, 'Comment must be at least 2 characters long.'],
            maxLength: [1000, 'Comment must be at most 1000 characters long.'],
            trim: true
        },
        taskId: { 
            type: Schema.Types.ObjectId, 
            ref: 'Task', 
            required: true 
        },
        userId: { 
            type: Schema.Types.ObjectId, 
            ref: 'User', 
            required: true 
        },
        organizationId: { 
            type: Schema.Types.ObjectId, 
            ref: 'Organization', 
            required: true 
        },
    },
    { timestamps: { createdAt: true, updatedAt: false }},
);

commentSchema.set('toJSON', {
    transform: function (_doc, ret: Record<string, unknown>) {
      if (ret._id && typeof ret._id === 'object' && 'toString' in ret._id) {
        ret.id = (ret._id as { toString(): string }).toString();
      }
  
      delete ret._id;
      delete ret.__v;
    }
});
  
const Comment = model<IComment>('Comment', commentSchema);

export default Comment;