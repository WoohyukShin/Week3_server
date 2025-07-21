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

// 환경에 따라 CORS 옵션 분기
const isProduction = process.env.NODE_ENV === 'production';
const allowedOrigins = isProduction
  ? [
      'http://143.248.184.29:5174',
      'https://143.248.184.29:5174',
      'http://localhost:5174',
      'https://week3client-production.up.railway.app',
      // 실제 프론트 배포 도메인 추가
    ]
  : true;

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200
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
    
    // CORS 헤더 추가.. 아니 왜 안 됨???
    app.use((req, res, next) => {
      const origin = req.headers.origin;
      if (origin) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Vary', 'Origin');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
      }
      if (req.method === 'OPTIONS') {
        res.status(200).end(); // 204 대신 200으로 응답
        return;
      }
      next();
    });
    
    // HTTP 요청 로그 미들웨어
    app.use((req, res, next) => {
      console.log(`📡 HTTP ${req.method} ${req.url} - ${new Date().toISOString()}`);
      console.log(`📋 Headers:`, req.headers);
      if (req.body && Object.keys(req.body).length > 0) {
        console.log(`📦 Body:`, req.body);
      }
      next();
    });
    
    // 상세 HTTP 요청/응답 로깅 미들웨어 (개발/디버깅용)
    app.use(async (req, res, next) => {
      console.log('======== HEADER ========');
      console.log(req.method, req.url);
      console.log(req.headers);
      console.log('========= BODY =========');
      if (req.body && Object.keys(req.body).length > 0) {
        console.log(req.body);
      } else {
        console.log('(empty)');
      }
      // 응답 로깅을 위해 res.send를 감싼다
      const oldSend = res.send;
      res.send = function (body) {
        console.log('======= RESPONSE =======');
        // 응답 헤더
        console.log(res.getHeaders());
        // 응답 바디
        try {
          const parsed = typeof body === 'string' ? JSON.parse(body) : body;
          console.log(parsed);
        } catch {
          console.log(body);
        }
        console.log('========================');
        // 원래 send 호출
        return oldSend.call(this, body);
      };
      next();
    });
    
    // JSON 파싱 미들웨어
    app.use(express.json());
    
    // 라우터 설정
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
  