import conn from '../mariadb.js';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

export const join = (req, res) => {
  const { email, password } = req.body;

  const salt = crypto.randomBytes(10).toString('base64');
  const hashedPassword = crypto
    .pbkdf2Sync(password, salt, 10000, 10, 'sha512')
    .toString('base64');

  const sql = 'INSERT INTO users (email, password, salt) VALUES (?, ?,?)';
  const values = [email, hashedPassword, salt];

  conn.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    console.log(result);
    return res.status(StatusCodes.CREATED).json(result);
  });
};

export const login = (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT * FROM users WHERE email = ? ';
  const values = [email];

  conn.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    const user = result[0];
    const hashedPassword = crypto
      .pbkdf2Sync(password, user.salt, 10000, 10, 'sha512')
      .toString('base64');

    if (user && hashedPassword == user.password) {
      const token = jwt.sign(
        {
          email: user.email,
        },
        process.env.PRIVATE_KEY,
        {
          expiresIn: '1h',
        },
      );
      res.cookie('token', token, { httpOnly: true });
      console.log(result);
      res
        .status(StatusCodes.OK)
        .json({ message: `${user.email}님, 환영합니다.` });
      return;
    } else {
      //http code : 01
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: '이메일 또는 비밀번호가 틀렸습니다.',
      });
    }
  });
};

export const requestPasswordReset = (req, res) => {
  const { email } = req.body;
  const sql = 'SELECT * FROM users WHERE email = ?';
  const values = [email];

  conn.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    const user = result[0];
    if (user) {
      return res.status(StatusCodes.OK).json({
        email: email,
        message: '비밀번호 재설정 링크가 이메일로 전송되었습니다.',
      });
    } else {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: '해당 이메일을 찾을 수 없습니다.',
      });
    }
  });
};

export function updateUserPassword(req, res) {
  const { email, password } = req.body;

  const salt = crypto.randomBytes(10).toString('base64');
  const hashedPassword = crypto
    .pbkdf2Sync(password, salt, 10000, 10, 'sha512')
    .toString('base64');

  const sql = 'UPDATE users SET password=?, salt=?  WHERE email = ? ';
  const values = [hashedPassword, salt, email];

  conn.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    if (result.affectedRows > 0) {
      return res.status(StatusCodes.OK).json({
        message: '비밀번호가 성공적으로 변경되었습니다.',
      });
    } else {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: '해당 이메일을 찾을 수 없습니다.',
      });
    }
  });
}
