import express, { Request, Response } from 'express'
import dotenv from 'dotenv';
const app = express();

dotenv.config();
import router from './routes/root'; 
import { connectDB } from './lib/db';

const PORT = process.env.PORT ;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req:Request, res:Response) => {
  res.send('Hello World!'); 
}) 
connectDB().then(() => {
  console.log('Database connected successfully');
} ).catch((error) => {
  console.error('Database connection failed:', error);  
}) 
app.use('/api', router); 

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

});