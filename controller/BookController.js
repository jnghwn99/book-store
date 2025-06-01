import conn from '../mariadb.js';
import { StatusCodes } from 'http-status-codes';

export const bookList = (req, res) => {
  let allBooksRes = {};

  const { limit, page, category_id, new_released } = req.query;
  const offset = limit * (page - 1);

  let sql =
    'SELECT SQL_CALC_FOUND_ROWS *, (SELECT count(*) FROM likes WHERE book_id = books.id ) AS likes FROM books';
  let values = [];

  if (category_id && new_released) {
    sql +=
      ' WHERE category_id = ? AND published_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()';
    values = [category_id];
  } else if (category_id) {
    sql += ' WHERE category_id = ?';
    values = [category_id];
  } else if (new_released) {
    sql +=
      ' WHERE published_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()';
  }
  sql += ' LIMIT ? OFFSET ?';
  values.push(parseInt(limit), offset);

  conn.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      // return res.status(StatusCodes.BAD_REQUEST).end();
    }
    if (result.length > 0) {
      console.log(result);
      allBooksRes.books = result;
    } else {
      console.log('No books found');
      return res.status(StatusCodes.NOT_FOUND).end();
    }
  });

  sql = 'SELECT found_rows()';
  conn.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    if (result) {
      console.log(result);

      let pagination = {};
      pagination.totalCount = result[0]['found_rows()'];
      pagination.currentPage = page;
      allBooksRes.pagination = pagination;
      return res.status(StatusCodes.OK).json(allBooksRes);
    } else {
      return res.status(StatusCodes.NOT_FOUND).end();
    }
  });
};

export const bookDetail = (req, res) => {
  const auth = decodeJwt(req, res);
  if (auth instanceof jwt.TokenExpiredError) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Unauthorized' });
  }
  if (auth instanceof jwt.JsonWebTokenError) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Invalid token' });
  }
  if (auth instanceof ReferenceError) {
    const conn = db();
    const bookListSql = `SELECT books.*, 
    (SELECT count(*) FROM likes WHERE book_id = books.id ) AS likes,
    categories.name AS category_name
    FROM books
    LEFT JOIN categories 
    ON books.category_id = categories.id 
    WHERE books.id = ?`;
    const bookListValue = [bookId];

    conn.query(bookListSql, bookListValue, (err, result) => {
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
  }

  const conn = db();
  const { id: bookId } = req.params;
  const sql = `SELECT books.*, 
    (SELECT count(*) FROM likes WHERE book_id = books.id ) AS likes,
    (SELECT EXISTS (SELECT * FROM likes WHERE user_id = ? AND book_id = ?)) AS is_liked,
    categories.name AS category_name
    FROM books
    LEFT JOIN categories 
    ON books.category_id = categories.id 
    WHERE books.id = ?`;
  const values = [auth.id, bookId, bookId];

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
