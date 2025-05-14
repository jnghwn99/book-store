import express from 'express';
const router = express.Router();
router.use(express.json());
export default router;

// join
router.post('/join', (req, res) => {
  res.json('joing');
});

// login
router.post('/login', (req, res) => {
  res.json('로그인');
});

// password reset request
router.post('/reset', (req, res) => {
  res.json('비밀번호 재설정 요청');
});

// password reset
router.put('/reset', (req, res) => {
  res.json('비밀번호 재설정');
});
