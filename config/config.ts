interface DbConfig {
  uri: string;
}

interface ServerConfig {
  port: string | number;
}

interface JwtConfig {
  secret: string;
  expiresIn: string;
}

export const database: DbConfig = {
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/stealing-dance-game',
};

export const server: ServerConfig = {
  port: process.env.PORT || 3001,
};

export const jwt: JwtConfig = {
  secret: process.env.JWT_SECRET || 'your-very-secret-key-change-in-production',
  expiresIn: '24h',
};
