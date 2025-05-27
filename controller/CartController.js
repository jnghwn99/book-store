import conn from '../mariadb.js';
import { StatusCodes } from 'http-status-codes';
import { decodeJwt } from '../auth.js';
import jwt from 'jsonwebtoken';

export const getCartItem = (req, res) => {
  let selected;
  const auth = decodeJwt(req, res);

  if (auth instanceof jwt.TokenExpiredError) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Unauthorized' });
  } else if (auth instanceof jwt.JsonWebTokenError) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Invalid token' });
  } else {
    let sql = `SELECT cartItems.id, book_id, title, summary, quantity, price FROM cartItems
            LEFT JOIN books ON cartItems.book_id = books.id
            WHERE user_id = ?`;
    let values = [auth.id];

    if (req.query.selected) {
      selected = req.query.selected;
      sql += ` AND cartItems.id IN (?)`;
      values.push(selected);
    }

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
  }
};

export const addCartItem = (req, res) => {
  const { book_id, quantity } = req.body;

  const auth = decodeJwt(req, res);

  if (auth instanceof jwt.TokenExpiredError) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Unauthorized' });
  } else if (auth instanceof jwt.JsonWebTokenError) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Invalid token' });
  } else {
    const sql =
      'INSERT INTO cartItems (user_id, book_id, quantity) VALUES (?, ?, ?)';
    const values = [auth.id, book_id, quantity];

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
  }
};

export const deleteCartItem = (req, res) => {
  const { id: cartItemId } = req.params;
  const sql = 'DELETE FROM cartItems WHERE id = ?';
  const values = [cartItemId];

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
