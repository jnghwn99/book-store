import express from 'express';
const router = express.Router();
router.use(express.json());
export default router;

router.post('/:id', (req, res) => {
  res.json('좋아요 추가');
});
router.delete('/:id', (req, res) => {
  res.json('좋아요 삭제');
});
