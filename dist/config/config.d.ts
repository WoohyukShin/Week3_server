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
export declare const database: DbConfig;
export declare const server: ServerConfig;
export declare const jwt: JwtConfig;
export {};
//# sourceMappingURL=config.d.ts.map