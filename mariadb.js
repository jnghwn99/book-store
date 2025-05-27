import mysql from 'mysql2';

const connection = async () => {
  return await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: 3306,
    timezone: '+09:00',
    database: 'book-store',
    dateStrings: true,
  });
};

export default connection;
