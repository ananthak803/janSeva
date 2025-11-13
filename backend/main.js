import express from 'express';
import dotenv from 'dotenv';
import residentAuth from './routes/residentAuth.js';
import connectDB from "./connectio.js";
import issue from './routes/issue.js'
import adminAuth from './routes/adminAuth.js'
import admin from './routes/admin.js'
import cors from 'cors'

dotenv.config();
const app=express();
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cors({
//   origin: "*",  
//   methods: ["GET", "POST"],
//   credentials: true
// }));

const PORT=process.env.PORT;

app.use('/api/resident',residentAuth)
app.use('/api/issue',issue)
app.use('/admin/signin',adminAuth)
app.use('/admin',admin)

app.get("/",(req,res)=>{
    res.send(`server running on port ${PORT}`);
})

app.listen(PORT,()=>console.log(`server running on port ${PORT}`));
