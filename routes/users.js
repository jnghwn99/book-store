import express from 'express';
const router = express.Router();
router.use(express.json());
export default router;

import {
  join,
  login,
  passwordResetRequest,
  passwordReset,
} from '../controller/UserController.js';

// 회원가입
router.post('/join', join);

// login
router.post('/login', login);

// password reset
router.post('/reset', passwordResetRequest).put('/reset', passwordReset);
