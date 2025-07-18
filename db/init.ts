import mongoose from 'mongoose';
import User from './models/User';
import { database } from '../config/config';

const initializeDatabase = async (): Promise<void> => {
  try {
    console.log('🔧 Initializing database...');
    
    // 컬렉션이 존재하는지 확인
    const db = mongoose.connection.db;
    if (db) {
      const collections = await db.listCollections().toArray();
      console.log('📋 Existing collections:', collections.map(c => c.name));
      
      // User 컬렉션이 없으면 생성 (Mongoose가 자동으로 생성하지만 명시적으로 확인)
      if (!collections.find(c => c.name === 'users')) {
        console.log('👥 Creating users collection...');
        await User.createCollection();
      }
    }
    
    // 기본 관리자 계정 생성 (선택사항)
    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
      console.log('👑 Creating default admin user...');
      await User.create({
        username: 'admin',
        password: 'admin123',
        highScore: 0
      });
      console.log('✅ Default admin user created');
    }
    
    console.log('✅ Database initialization completed!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
};

export default initializeDatabase; 