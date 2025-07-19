"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwt = exports.server = exports.database = void 0;
// 환경 구분
const isProduction = process.env.NODE_ENV === 'production';
// MongoDB URI 우선순위: MONGODB_URI > MONGODB_URL > 기본값
const getMongoDBUri = () => {
    if (process.env.MONGODB_URI) {
        return process.env.MONGODB_URI;
    }
    if (process.env.MONGODB_URL) {
        return process.env.MONGODB_URL;
    }
    return 'mongodb://localhost:27017/stealing-dance-game';
};
// 환경 변수 디버깅
console.log('🔍 Environment Variables Debug:');
console.log('  NODE_ENV:', process.env.NODE_ENV);
console.log('  PORT:', process.env.PORT);
console.log('  MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('  MONGODB_URL exists:', !!process.env.MONGODB_URL);
console.log('  MONGODB_URI length:', process.env.MONGODB_URI?.length || 0);
console.log('  MONGODB_URL length:', process.env.MONGODB_URL?.length || 0);
console.log('  Final URI length:', getMongoDBUri().length);
console.log('  Final URI value:', getMongoDBUri());
console.log('  JWT_SECRET exists:', !!process.env.JWT_SECRET);
console.log('  Is Production:', isProduction);
// 환경 변수 검증
if (isProduction && !process.env.MONGODB_URI && !process.env.MONGODB_URL) {
    console.error('❌ CRITICAL ERROR: Neither MONGODB_URI nor MONGODB_URL is set in production!');
    console.error('Please set MONGODB_URI or MONGODB_URL environment variable in Railway dashboard.');
    process.exit(1);
}
exports.database = {
    uri: getMongoDBUri(),
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
if (isProduction) {
    const uri = getMongoDBUri();
    console.log(`🔗 Production URI starts with: ${uri.substring(0, 20)}...`);
}
//# sourceMappingURL=config.js.map