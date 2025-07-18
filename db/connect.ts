import mongoose from 'mongoose';
import { database } from '../config/config';

const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(database.uri);
        console.log('MongoDB connected successfully!');
    } catch (err) {
        console.error('MongoDB connection failed:', err);
        process.exit(1);
    }
};

export default connectDB;
