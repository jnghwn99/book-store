import conn from '../mariadb.js';

import { StatusCodes } from 'http-status-codes';
import { decodeJwt } from '../auth.js';
import jwt from 'jsonwebtoken';

export const order = async (req, res) => {
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

  try {
    const { items, delivery, totalQuantity, totalPrice, firstBookTitle } =
      req.body;

    const deliverySql =
      'INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?)';
    const deliverValues = [
      delivery.address,
      delivery.receiver,
      delivery.contact,
    ];
    const [deliveryResult] = await conn.execute(deliverySql, deliverValues);
    const deliveryId = deliveryResult.insertId;

    const orderSql =
      'INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id) VALUES (?, ?, ?,  ?, ?)';
    const orderValues = [
      firstBookTitle,
      totalQuantity,
      totalPrice,
      auth.id,
      deliveryId,
    ];
    const [orderResult] = await conn.execute(orderSql, orderValues);
    const orderId = orderResult.insertId;

    //
    const orderItemsSql =
      'SELECT book_id, quantity FROM cartItems WHERE id IN (?)';
    const [orderItems, fields] = await conn.query(orderItemsSql, [items]);

    //
    const orderBookListSql =
      'INSERT INTO order_book_list (order_id, book_id, quantity) VALUES ?';
    const orderBookListValues = orderItems.map((item) => [
      orderId,
      item.book_id,
      item.quantity,
    ]);
    await conn.query(orderBookListSql, [orderBookListValues]);
    let result = await deleteCartItems(conn, items);

    return res.status(StatusCodes.CREATED).json(result);
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Error Catched, 에러가 발생했습니다.',
    });
  }
};

const deleteCartItems = async (conn, items) => {
  const sql = 'DELETE FROM cartItems WHERE id IN (?)';

  const result = await conn.query(sql, [items]);
  return result;
};

export const getOrderList = async (req, res) => {
  const sql = `SELECT orders.id, book_title, total_quantity, total_price, create_at, address, receiver, contact
                FROM orders LEFT JOIN delivery on orders.delivery_id = delivery.id`;
  const values = [];

  let [rows, fields] = await conn.query(sql, values);

  return res.status(StatusCodes.OK).json({
    orders: rows,
  });
};

export const getOrderById = async (req, res) => {
  const { id: orderId } = req.params;

  try {
    const sql = `SELECT book_id, title, author, price, quantity
                FROM order_book_list LEFT JOIN books ON order_book_list.book_id = books.id
                WHERE order_id = ?`;
    const values = [orderId];

    let [rows, fields] = await conn.query(sql, values);

    return res.status(StatusCodes.OK).json({
      orders: rows,
    });
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Error Catched, 에러가 발생했습니다.',
    });
  }
};
