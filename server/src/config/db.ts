import mongoose from 'mongoose';
import { MONGODB_URI } from './env';

const connectDB = async() => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('connected to mongodb..');
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('MONGODB connection failed.', error.message);
        } else {
            console.error('MONGODB connection failed with unknown error.');

        }
    }
};

export default connectDB;