import express from 'express';
const router = express.Router();
router.use(express.json());
export default router;

router.post('/', (req, res) => {
  res.json('장바구니 담기');
});
router.get('/', (req, res) => {
  res.json('장바구니 조회');
});
router.delete('/:id', (req, res) => {
  res.json('장바구니 삭제');
});
// router.get('/', (req, res) => {
//   res.json('장바구니에서 주문할 상품 조회');
// });
