import express from 'express';
const router = express.Router();
router.use(express.json());
export default router;

router.get('/', (req, res) => {
  res.json('책 목록');
});
router.get('/', (req, res) => {
  res.json('카테고리별 도서 조회');
});

router.get('/:id', (req, res) => {
  res.json('책 상세');
});
