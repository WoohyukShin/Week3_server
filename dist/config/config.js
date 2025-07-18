"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwt = exports.server = exports.database = void 0;
// 환경 구분
const isProduction = process.env.NODE_ENV === 'production';
// 환경 변수 디버깅
console.log('🔍 Environment Variables Debug:');
console.log('  NODE_ENV:', process.env.NODE_ENV);
console.log('  PORT:', process.env.PORT);
console.log('  MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('  MONGODB_URI length:', process.env.MONGODB_URI?.length || 0);
console.log('  JWT_SECRET exists:', !!process.env.JWT_SECRET);
exports.database = {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/stealing-dance-game',
    name: isProduction ? 'Production MongoDB' : 'Local MongoDB',
};
exports.server = {
    port: process.env.PORT || 3001,
    env: process.env.NODE_ENV || 'development',
};
exports.jwt = {
    secret: process.env.JWT_SECRET || 'your-very-secret-key-change-in-production',
    expiresIn: '24h',
};
// 환경 정보 출력
console.log(`🚀 Server Environment: ${exports.server.env}`);
console.log(`📊 Database: ${exports.database.name}`);
console.log(`🔗 Database URI: ${isProduction ? '[PRODUCTION]' : exports.database.uri}`);
console.log(`🌐 Server Port: ${exports.server.port}`);
if (isProduction && process.env.MONGODB_URI) {
    console.log(`🔗 Production URI starts with: ${process.env.MONGODB_URI.substring(0, 20)}...`);
}
//# sourceMappingURL=config.js.map