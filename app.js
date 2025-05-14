import dotenv from 'dotenv';
dotenv.config();
const PORT = process.env.PORT || 3000;

import exrpess from 'express';
const app = exrpess();

import userRouter from './routes/users.js';
app.use('/', userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
