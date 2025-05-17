import express from 'express';
const router = express.Router();
router.use(express.json());
export default router;

import { bookList, bookDetail } from '../controller/BookController.js';

// 전체 도서 조회
router.get('/', bookList);

// 개별 도서 조회
router.get('/:id', bookDetail);
