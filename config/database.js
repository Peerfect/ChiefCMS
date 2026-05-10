const dbType = process.env.DB_TYPE || 'mysql';

const defaultMysql = {
  key: "primary",
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "123456",
    database: process.env.DB_DATABASE || "chancms"
  },
  pool: {
    min: parseInt(process.env.DB_POOL_MIN || 2),
    max: parseInt(process.env.DB_POOL_MAX || 10)
  }
};

const defaultSqlite = {
  key: "primary",
  client: "sqlite3",
  connection: {
    filename: process.env.DB_FILEPATH || "./data/chancms.sqlite"
  },
  useNullAsDefault: true
};

export const db = [
  dbType === 'sqlite' ? defaultSqlite : defaultMysql
];

export default {
  db
}
