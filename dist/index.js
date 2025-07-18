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
const user_1 = __importDefault(require("./routers/user"));
const sockethandlers_1 = __importDefault(require("./handlers/sockethandlers"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
// CORS 설정
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? ['https://your-frontend-domain.railway.app'] // 실제 프론트엔드 도메인으로 변경
        : ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
// cors: corsOptions
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*", // 실제 프로덕션에서는 특정 도메인만 허용하도록 변경해야 합니다.
        methods: ["GET", "POST"]
    }
});
// 데이터베이스 연결
(0, connect_1.default)();
// 미들웨어 설정
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use('/api/users', user_1.default);
// 헬스체크 엔드포인트
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});
// Socket.io 핸들러 초기화
(0, sockethandlers_1.default)(io);
// 서버 시작
const PORT = Number(config_1.server.port) || 3001;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
//# sourceMappingURL=index.js.map