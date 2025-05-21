import conn from '../mariadb.js';
import { StatusCodes } from 'http-status-codes';

export const getCartItem = (req, res) => {
  const { user_id, selected } = req.body;
  const sql = `SELECT cartItems.id, book_id, title, summary, quantity, price FROM cartItems
            LEFT JOIN books ON cartItems.book_id = books.id
            WHERE user_id = ? AND cartItems.id IN (?)`;
  const values = [user_id, selected];

  conn.query(sql, values, (err, result) => {
    conn.query(sql, values, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
      }
      if (result.length > 0) {
        console.log(result);
        return res.status(StatusCodes.OK).json(result);
      } else {
        return res.status(StatusCodes.NOT_FOUND).end();
      }
    });
  });
};

export const addCartItem = (req, res) => {
  const { user_id, book_id, quantity } = req.body;
  const sql =
    'INSERT INTO cartItems (user_id, book_id, quantity) VALUES (?, ?, ?)';
  const values = [user_id, book_id, quantity];

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

export const deleteCartItem = (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM cartItems WHERE id = ?';
  const values = [id];

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
