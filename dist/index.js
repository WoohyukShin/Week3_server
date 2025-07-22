"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config/config");
const connect_1 = __importDefault(require("./db/connect"));
const init_1 = __importDefault(require("./db/init"));
const user_1 = __importDefault(require("./routers/user"));
const sockethandlers_1 = __importDefault(require("./handlers/sockethandlers"));
// 모델들을 명시적으로 import하여 스키마 등록
require("./db/models/User");
const allowedOrigins = [
    'http://143.248.184.25:5173',
    'http://172.29.80.1:5173',
    'http://143.248.184.25:5174',
    'http://172.29.80.1:5174',
    'http://localhost:5175',
    'http://127.0.0.1:5175',
    'http://143.248.184.25:5175',
    'http://192.168.35.3:5175',
    'https://week3client-production.up.railway.app', // 살려주세요
];
const corsOptions = {
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    optionsSuccessStatus: 200,
};
const app = (0, express_1.default)();
app.use((0, cors_1.default)(corsOptions));
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, { cors: corsOptions });
// 데이터베이스 연결
const startServer = async () => {
    try {
        console.log('📊 Attempting to connect to database...');
        await (0, connect_1.default)();
        console.log('✅ Database connected successfully');
        console.log('🔧 Initializing database...');
        await (0, init_1.default)();
        console.log('✅ Database initialized successfully');
        console.log('🔧 Setting up middleware...');
        // HTTP 요청 로그 미들웨어
        app.use((req, res, next) => {
            console.log(`📡 HTTP ${req.method} ${req.url} - ${new Date().toISOString()}`);
            console.log(`📋 Headers:`, req.headers);
            if (req.body && Object.keys(req.body).length > 0) {
                console.log(`📦 Body:`, req.body);
            }
            next();
        });
        // JSON 파싱 미들웨어
        app.use(express_1.default.json());
        // 라우터 설정
        app.use('/api/users', (0, cors_1.default)(corsOptions), user_1.default);
        console.log('✅ Middleware configured');
        // 헬스체크 엔드포인트
        app.get('/health', (0, cors_1.default)(corsOptions), (req, res) => {
            try {
                console.log('🏥 Health check requested');
                res.status(200).json({
                    status: 'OK',
                    timestamp: new Date().toISOString(),
                    environment: process.env.NODE_ENV || 'development',
                    database: 'Connected',
                    port: config_1.server.port
                });
            }
            catch (error) {
                console.error('❌ Health check error:', error);
                res.status(500).json({
                    status: 'ERROR',
                    message: 'Health check failed',
                    error: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
        // 루트 경로도 헬스체크로 사용
        app.get('/', (req, res) => {
            res.status(200).json({
                message: 'Stealing Dance Game Server is running!',
                environment: process.env.NODE_ENV || 'development',
                timestamp: new Date().toISOString(),
                status: 'OK'
            });
        });
        console.log('🔧 Setting up Socket.IO handlers...');
        (0, sockethandlers_1.default)(io);
        console.log('✅ Socket.IO handlers configured');
        // 서버 시작
        const PORT = Number(process.env.PORT) || Number(config_1.server.port) || 3001;
        console.log(`🌐 Starting server on port ${PORT}...`);
        server.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Server is running on port ${PORT}`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`📊 Database: Connected and ready`);
            console.log(`🔌 Socket.IO: Ready for connections`);
            console.log(`🏥 Health check available at: http://localhost:${PORT}/health`);
            console.log(`📡 Server ready to accept connections!`);
        });
        // 서버 에러 핸들링
        server.on('error', (error) => {
            console.error('❌ Server error:', error);
            process.exit(1);
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        console.error('❌ Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
        });
        process.exit(1);
    }
};
// 프로세스 에러 핸들링
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});
console.log('🚀 Starting server...');
startServer();
//# sourceMappingURL=index.js.map