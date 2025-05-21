import express from 'express';
const router = express.Router();
router.use(express.json());
export default router;

import {
  getCartItem,
  addCartItem,
  deleteCartItem,
} from '../controller/CartController.js';

router.get('/', getCartItem);
router.post('/', addCartItem);
router.delete('/:id', deleteCartItem);
