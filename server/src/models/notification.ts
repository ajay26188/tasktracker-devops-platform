// /models/notification.ts

import { Schema, model } from 'mongoose';
import { INotification } from '../types/notification';

const notificationSchema = new Schema(
    {
        message: { 
            type: String, 
            required: true,
            maxLength: [1000, 'Message must be at most 1000 characters long.'],
            trim: true
        },
        userId: { 
            type: Schema.Types.ObjectId, 
            ref: 'User', 
            required: true 
        },
        isRead: { 
            type: Boolean, 
            default: false 
        },
    },
    { timestamps: { createdAt: true, updatedAt: false }},
);

notificationSchema.set('toJSON', {
    transform: function (_doc, ret: Record<string, unknown>) {
      if (ret._id && typeof ret._id === 'object' && 'toString' in ret._id) {
        ret.id = (ret._id as { toString(): string }).toString();
      }
  
      delete ret._id;
      delete ret.__v;
    }
});
  

const Notification = model<INotification>('Notification', notificationSchema);

export default Notification;