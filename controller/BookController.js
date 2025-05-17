import conn from '../mariadb.js';
import { StatusCodes } from 'http-status-codes';

import dotenv from 'dotenv';
dotenv.config();

export const bookList = (req, res) => {
  const { limit, page, category_id, new_released } = req.query;
  const offset = limit * (page - 1);

  let sql = 'SELECT * FROM books';
  let values = [];

  if (category_id && new_released) {
    sql +=
      ' WHERE category_id = ? AND published_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()';
    values.push(category_id);
  } else if (category_id) {
    sql += ' WHERE category_id = ?';
    values.push(category_id);
  } else if (new_released) {
    sql +=
      ' WHERE published_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()';
  }
  sql += ' LIMIT ? OFFSET ?';
  values.push(parseInt(limit), offset);

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
};

export const bookDetail = (req, res) => {
  const { id } = req.params;
  const sql = `SELECT books.*, categories.name AS category_name
    FROM books
    LEFT JOIN categories 
    ON books.category_id = categories.id 
    WHERE books.id = ?`;
  const values = [id];

  conn.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    if (result[0]) {
      console.log(result);
      return res.status(StatusCodes.OK).json(result[0]);
    } else {
      return res.status(StatusCodes.NOT_FOUND).end();
    }
  });
};
