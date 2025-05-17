import express from 'express';
const router = express.Router();
router.use(express.json());
export default router;

import { categoryList } from '../controller/CategoryController.js';

// 전체 도서 조회
router.get('/', categoryList);
