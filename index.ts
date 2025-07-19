import express from 'express';
import http from 'http';
import { Server } from "socket.io";
import cors from 'cors';

import { server as serverConfig } from './config/config';
import connectDB from './db/connect';
import initializeDatabase from './db/init';
import userRouter from './routers/user';
import initializeSocketHandlers from './handlers/sockethandlers';

// 모델들을 명시적으로 import하여 스키마 등록
import './db/models/User';

const app = express();
const server = http.createServer(app);

console.log('🚀 Starting server initialization...');

// 모든 도메인 허용
const corsOptions = {
  origin: '*', // 나중에 도메인으로 변경
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

const io = new Server(server, {
  cors: corsOptions
});

console.log('🔧 CORS and Socket.IO configured');

// 데이터베이스 연결
const startServer = async () => {
  try {
    console.log('📊 Attempting to connect to database...');
    await connectDB();
    console.log('✅ Database connected successfully');
    
    console.log('🔧 Initializing database...');
    await initializeDatabase();
    console.log('✅ Database initialized successfully');
    
    console.log('🔧 Setting up middleware...');
    // 미들웨어 설정
    app.use(cors(corsOptions));
    app.use(express.json());
    
    // HTTP 요청 로그 미들웨어
    app.use((req, res, next) => {
      console.log(`📡 HTTP ${req.method} ${req.url} - ${new Date().toISOString()}`);
      console.log(`📋 Headers:`, req.headers);
      if (req.body && Object.keys(req.body).length > 0) {
        console.log(`📦 Body:`, req.body);
      }
      next();
    });
    
    app.use('/api/users', userRouter);
    console.log('✅ Middleware configured');

    // 헬스체크 엔드포인트
    app.get('/health', (req, res) => {
      try {
        console.log('🏥 Health check requested');
        res.status(200).json({ 
          status: 'OK', 
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV || 'development',
          database: 'Connected',
          port: serverConfig.port
        });
      } catch (error) {
        console.error('❌ Health check error:', error);
        res.status(500).json({ 
          status: 'ERROR', 
          message: 'Health check failed',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // 루트 엔드포인트
    app.get('/', (req, res) => {
      res.json({ 
        message: 'Stealing Dance Game Server is running!',
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString()
      });
    });

    console.log('🔧 Setting up Socket.IO handlers...');
    // Socket.io 핸들러 초기화
    initializeSocketHandlers(io);
    console.log('✅ Socket.IO handlers configured');

    // 서버 시작
    const PORT = Number(serverConfig.port) || 3001;
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

  } catch (error) {
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
