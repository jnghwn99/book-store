import express from 'express';
const router = express.Router();
router.use(express.json());
export default router;

import {
  order,
  getOrderList,
  getOrderById,
} from '../controller/OrderController.js';

router.post('/', order);
router.get('/', getOrderList);
router.get('/:id', getOrderById);
