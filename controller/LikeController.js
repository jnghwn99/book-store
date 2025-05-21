import conn from '../mariadb.js';
import { StatusCodes } from 'http-status-codes';

export const addLike = (req, res) => {
  const { user_id } = req.body;
  const { id } = req.params;

  const sql = 'INSERT INTO likes (user_id, book_id) VALUES (?, ?)';
  const values = [user_id, id];

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
  const sql = 'DELETE FROM likes WHERE user_id = ? AND book_id = ?';
  const values = [req.body.user_id, req.params.id];

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
