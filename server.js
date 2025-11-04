import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRouter from './routes/authRoutes.js';
import sessionRouter from './routes/sessionRoutes.js';

dotenv.config();
connectDB();

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }));

app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/sessions', sessionRouter);

app.listen(process.env.PORT || 5050);
