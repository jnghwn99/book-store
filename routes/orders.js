import express from 'express';
const router = express.Router();
router.use(express.json());
export default router;

router.post('/', (req, res) => {
  res.json('주문하기');
});
router.get('/', (req, res) => {
  res.json('주문 목록 조회');
});
router.get('/:id', (req, res) => {
  res.json('주문 상세상품 조회회 ');
});
