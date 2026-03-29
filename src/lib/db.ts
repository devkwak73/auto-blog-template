import mysql from "mysql2/promise";

// DATABASE_SOCKET 설정 시 MAMP 소켓 연결 (로컬 개발)
// DATABASE_SOCKET 미설정 시 TCP 연결 (운영 환경)
const pool = mysql.createPool({
  host: process.env.DATABASE_HOST || "127.0.0.1",
  port: Number(process.env.DATABASE_PORT) || 3306,
  user: process.env.DATABASE_USER || "root",
  password: process.env.DATABASE_PASSWORD || "",
  database: process.env.DATABASE_NAME || "auction_blog",
  socketPath: process.env.DATABASE_SOCKET || undefined,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: "utf8mb4",
  timezone: "+00:00",
});

export default pool;
