import config from '../config/default.mjs';
// Імпортуємо необхідний модуль
import mysql from 'mysql2/promise';

// Функція для підключення до MySQL
async function connectToMySQL() {
  try {
    const pool = await mysql.createPool({
      host: config.db.mysql.host,
      user: config.db.mysql.user,
      password: config.db.mysql.password,
      database: config.db.mysql.database,
    });
    console.log('Successful connection to the MySQL');
    return pool;
  } catch (err) {
    console.error('Error connection to the MySQL:', err);
  }
}

const pool = await connectToMySQL();

export default pool;
