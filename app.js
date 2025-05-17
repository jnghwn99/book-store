import dotenv from 'dotenv';
dotenv.config();
const PORT = process.env.PORT || 3000;

import express from 'express';
const app = express();
app.use(express.json());

import userRouter from './routes/users.js';
import bookRouter from './routes/books.js';
import categoryRouter from './routes/categories.js';
import cartRouter from './routes/carts.js';
import likeRouter from './routes/likes.js';
import orderRouter from './routes/orders.js';
app.use('/users', userRouter);
app.use('/books', bookRouter);
app.use('/categories', categoryRouter);
app.use('/carts', cartRouter);
app.use('/likes', likeRouter);
app.use('/orders', orderRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
