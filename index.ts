import express from 'express';
import http from 'http';
import { Server } from "socket.io";
import cors from 'cors';

import { server as serverConfig } from './config/config';
import connectDB from './db/connect';
import userRouter from './routers/user';
import initializeSocketHandlers from './handlers/sockethandlers';

const app = express();
const server = http.createServer(app);

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
const io = new Server(server, {
    cors: {
        origin: "*", // 실제 프로덕션에서는 특정 도메인만 허용하도록 변경해야 합니다.
        methods: ["GET", "POST"]
    }
});

// 데이터베이스 연결
connectDB();

// 미들웨어 설정
app.use(cors(corsOptions));
app.use(express.json());
app.use('/api/users', userRouter);

// 헬스체크 엔드포인트
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Socket.io 핸들러 초기화
initializeSocketHandlers(io);

// 서버 시작
const PORT = Number(serverConfig.port) || 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
