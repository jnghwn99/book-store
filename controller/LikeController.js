import conn from '../mariadb.js';
import { StatusCodes } from 'http-status-codes';
import { decodeJwt } from '../auth.js';
import dotenv from 'dotenv';
dotenv.config();

export const addLike = (req, res) => {
  const book_id = req.params.id;

  const decodedJwt = decodeJwt(req);

  const sql = 'INSERT INTO likes (user_id, book_id) VALUES (?, ?)';
  const values = [decodedJwt.id, book_id];

  conn.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    if (result.affectedRows > 0) {
      console.log(result);
      return res.status(StatusCodes.OK).json(result);
    } else {
      console.log(result);
      return res.status(StatusCodes.NOT_FOUND).end();
    }
  });
};

export const deleteLike = (req, res) => {
  const book_id = req.params.id;
  const decodedJwt = decodeJwt(req);

  const sql = 'DELETE FROM likes WHERE user_id = ? AND book_id = ?';
  const values = [decodedJwt.id, book_id];
  conn.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    if (result.affectedRows > 0) {
      console.log(result);
      return res.status(StatusCodes.OK).json(result);
    } else {
      console.log(result);
      return res.status(StatusCodes.NOT_FOUND).end();
    }
  });
};
