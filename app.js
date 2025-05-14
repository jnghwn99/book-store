import dotenv from 'dotenv';
dotenv.config();
const PORT = process.env.PORT || 3000;

import exrpess from 'express';
const app = exrpess();
app.use(express.json());

import bookRouter from './routes/books.js';
import cartRouter from './routes/carts.js';
import likeRouter from './routes/likes.js';
import orderRouter from './routes/orders.js';
import userRouter from './routes/users.js';
app.use('/books', bookRouter);
app.use('/carts', cartRouter);
app.use('/likes', likeRouter);
app.use('/orders', orderRouter);
app.use('/users', userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
