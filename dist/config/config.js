"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwt = exports.server = exports.database = void 0;
// 환경 구분
const isProduction = process.env.NODE_ENV === 'production';
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
//# sourceMappingURL=config.js.map