interface DbConfig {
  uri: string;
  name: string;
}

interface ServerConfig {
  port: string | number;
  env: string;
}

interface JwtConfig {
  secret: string;
  expiresIn: string;
}

// 환경 구분
const isProduction = process.env.NODE_ENV === 'production';

export const database: DbConfig = {
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/stealing-dance-game',
  name: isProduction ? 'Production MongoDB' : 'Local MongoDB',
};

export const server: ServerConfig = {
  port: process.env.PORT || 3001,
  env: process.env.NODE_ENV || 'development',
};

export const jwt: JwtConfig = {
  secret: process.env.JWT_SECRET || 'your-very-secret-key-change-in-production',
  expiresIn: '24h',
};

// 환경 정보 출력
console.log(`🚀 Server Environment: ${server.env}`);
console.log(`📊 Database: ${database.name}`);
console.log(`🔗 Database URI: ${isProduction ? '[PRODUCTION]' : database.uri}`);
