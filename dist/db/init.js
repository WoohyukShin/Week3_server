"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("./models/User"));
const initializeDatabase = async () => {
    try {
        console.log('🔧 Initializing database...');
        // 컬렉션이 존재하는지 확인
        const db = mongoose_1.default.connection.db;
        if (db) {
            const collections = await db.listCollections().toArray();
            console.log('📋 Existing collections:', collections.map(c => c.name));
            // User 컬렉션이 없으면 생성 (Mongoose가 자동으로 생성하지만 명시적으로 확인)
            if (!collections.find(c => c.name === 'users')) {
                console.log('👥 Creating users collection...');
                await User_1.default.createCollection();
            }
        }
        // 기본 관리자 계정 생성 (선택사항)
        const adminExists = await User_1.default.findOne({ username: 'admin' });
        if (!adminExists) {
            console.log('👑 Creating default admin user...');
            await User_1.default.create({
                username: 'admin',
                password: 'admin123',
                nickname: 'admin',
                highScore: 0
            });
            console.log('✅ Default admin user created');
        }
        console.log('✅ Database initialization completed!');
    }
    catch (error) {
        console.error('❌ Database initialization failed:', error);
        throw error;
    }
};
exports.default = initializeDatabase;
//# sourceMappingURL=init.js.map