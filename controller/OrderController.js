// import conn from '../mariadb.js';
import mariadb from 'mysql2/promise';
import { StatusCodes } from 'http-status-codes';

export const getOrderList = (req, res) => {};

export const getOrderById = (req, res) => {};

export const order = async (req, res) => {
  const conn = await mariadb.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: 3306,
    timezone: '+09:00',
    database: 'book-store',
    dateStrings: true,
  });

  let { items, delivery, totalQuantity, totalPrice, userId, firstBookTitle } =
    req.body;

  let sql =
    'INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?)';
  let values = [delivery.address, delivery.receiver, delivery.contact];

  let [result] = await conn.execute(sql, values);

  let delivery_id = result.insertId;

  sql =
    'INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id) VALUES (?, ?, ?,  ?, ?)';
  values = [firstBookTitle, totalQuantity, totalPrice, userId, delivery_id];

  [result] = await conn.execute(sql, values);
  let orderId = result.insertId;

  //
  sql = 'SELECT book_id, quantity FROM cartItems WHERE id IN (?)';
  let [orderItems, fields] = await conn.query(sql, [items]);

  //
  sql = 'INSERT INTO order_book_list (order_id, book_id, quantity) VALUES ?';
  values = [];
  orderItems.forEach((item) => {
    values.push([orderId, item.book_id, item.quantity]);
  });

  // result = await conn.query(sql, [values]);

  result = await deleteCartItems(conn, items);

  return res.status(StatusCodes.CREATED).json(result[0]);
};

const createDelivery = async (req, res) => {};
const createOrderBookList = async (req, res) => {};

const deleteCartItems = async (conn, items) => {
  const sql = 'DELETE FROM cartItems WHERE id IN (?)';

  const result = await conn.query(sql, [items]);
  return result;
};
