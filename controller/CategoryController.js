import conn from '../mariadb.js';
import { StatusCodes } from 'http-status-codes';

export const getCategory = (req, res) => {
  const sql = 'SELECT * FROM categories';
  const values = [];

  conn.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    if (Array.isArray(result) && result.length > 0) {
      console.log(result);
      return res.status(StatusCodes.OK).json(result);
    } else {
      return res.status(StatusCodes.NOT_FOUND).end();
    }
  });
};
