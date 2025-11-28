import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRouter from './routes/authRoutes.js';
import sessionRouter from './routes/sessionRoutes.js';
import rankingsRoutes from "./routes/rankings.js";
import coachRoutes from "./routes/coach.js"

connectDB();

const app = express();

app.use(cors({
origin: ['http://localhost:5173',
        'http://localhost:3000',
        'https://www.statmaxapp.me'
        ],
    credentials: true,
}));

app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/sessions', sessionRouter);
app.use("/api/rankings", rankingsRoutes);
app.use("/api/coach", coachRoutes);

app.get('/', (req, res) => {
    res.send('API is running');
});

app.use((err, req, res, next) => {
    console.error('Server Error:', err.stack);
    res.status(500).json({ message: 'Server error', error: err.message });
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
