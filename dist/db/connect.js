"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("../config/config");
const connectDB = async () => {
    try {
        console.log(`🔌 Connecting to ${config_1.database.name}...`);
        console.log(`📍 Environment: ${config_1.server.env}`);
        await mongoose_1.default.connect(config_1.database.uri);
        console.log(`✅ Successfully connected to ${config_1.database.name}!`);
        console.log(`📊 Database: ${mongoose_1.default.connection.db?.databaseName || 'Unknown'}`);
        console.log(`🌐 Host: ${mongoose_1.default.connection.host}`);
        console.log(`🔢 Port: ${mongoose_1.default.connection.port}`);
    }
    catch (err) {
        console.error(`❌ Failed to connect to ${config_1.database.name}:`, err);
        process.exit(1);
    }
};
exports.default = connectDB;
//# sourceMappingURL=connect.js.map