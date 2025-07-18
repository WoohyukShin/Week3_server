import mongoose from 'mongoose';
import { database, server } from '../config/config';

const connectDB = async (): Promise<void> => {
    try {
        console.log(`🔌 Connecting to ${database.name}...`);
        console.log(`📍 Environment: ${server.env}`);
        
        await mongoose.connect(database.uri);
        
        console.log(`✅ Successfully connected to ${database.name}!`);
        console.log(`📊 Database: ${mongoose.connection.db?.databaseName || 'Unknown'}`);
        console.log(`🌐 Host: ${mongoose.connection.host}`);
        console.log(`🔢 Port: ${mongoose.connection.port}`);
        
    } catch (err) {
        console.error(`❌ Failed to connect to ${database.name}:`, err);
        process.exit(1);
    }
};

export default connectDB;
