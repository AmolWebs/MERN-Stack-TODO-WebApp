import express from 'express';
import dotenv from 'dotenv'
import { connectDB } from './config/db.js';
import todoRoutes from './routes/todo.route.js'
import cors from 'cors'
dotenv.config()
const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/todos", todoRoutes)



app.listen(5000,() => {
    connectDB();
    console.log("Server started at http://localhost:5000")
});

