import express, { Request, Response } from 'express'
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
const app = express();

dotenv.config();
import router from './routes/root'; 
import { connectDB } from './lib/db';

const PORT = process.env.PORT ;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/', (req:Request, res:Response) => {
  res.send('Hello World!'); 
}) 
connectDB().then(() => {
  console.log('Database connected successfully');
} ).catch((error) => {
  console.error('Database connection failed:', error);  
}) 
console.log(`Client URL: ${process.env.CLIENT_URL}`);
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

app.use(cookieParser());

app.use('/api', router); 

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

});