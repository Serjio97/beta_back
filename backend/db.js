import mysql from 'mysql2/promise';

const db = await mysql.createPool({
  host: 'betawaves_sql',
  user: 'root',
  password: '8ef6e905734340e80e8a',     // replace if needed
  database: 'betawaves', // make sure this matches your DB name
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default db;
