"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwt = exports.server = exports.database = void 0;
exports.database = {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/stealing-dance-game',
};
exports.server = {
    port: process.env.PORT || 3001,
};
exports.jwt = {
    secret: process.env.JWT_SECRET || 'your-very-secret-key-change-in-production',
    expiresIn: '24h',
};
//# sourceMappingURL=config.js.map