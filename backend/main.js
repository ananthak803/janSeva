import express from 'express';
import dotenv from 'dotenv';
import residentAuth from './routes/residentAuth.js';
import connectDB from "./connectio.js";


dotenv.config();
const app=express();
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cors({
//   origin: "*",  
//   methods: ["GET", "POST"],
//   credentials: true
// }));

const PORT=process.env.PORT;

app.use('/api/resident',residentAuth)

app.get("/",(req,res)=>{
    res.send(`server running on port ${PORT}`);
})

app.listen(PORT,()=>console.log(`server running on port ${PORT}`));
