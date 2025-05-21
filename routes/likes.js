import express from 'express';
const router = express.Router();
router.use(express.json());
export default router;

import { addLike, deleteLike } from '../controller/LikeController.js';

router.post('/:id', addLike);
router.delete('/:id', deleteLike);
