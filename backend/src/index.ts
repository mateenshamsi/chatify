import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();

import router from './routes/root';
import { connectDB } from './lib/db';
import { server, app } from './lib/socket';

const PORT = parseInt(process.env.PORT || '5000', 10);

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.use('/api', router);

// DB Connection
connectDB()
  .then(() => console.log('Database connected successfully'))
  .catch((error) => console.error('Database connection failed:', error));

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Client URL: ${process.env.CLIENT_URL}`);
});
