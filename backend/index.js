import express, { urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";
import mongoose from 'mongoose';
import { User } from './models/user.model.js';
import userRouter from './routes/user.route.js';
import postRouter from './routes/post.route.js';
dotenv.config({})
const app=express();
app.get('/',(req,res)=>{
    return res.status(200).json({
        message:"I'm coming from backend",
        success:true
    })
})

const databaseURL=process.env.DATABASE
const PORT=process.env.PORT || 8000
// middlewares
app.use(express.json());
app.use(cookieParser());

app.use(urlencoded({extended:true}))

const corsOptions={
    origin:'http://localhost:5173',
    credentials:true,

}
app.use(cors(corsOptions));
app.use("/api/v1/user",userRouter)
app.use("/api/v1/post",postRouter)

app.listen(PORT,()=>{
    console.log(`Server listen at port ${PORT}`);
    
})
mongoose.connect(databaseURL).then(()=>console.log("DB Connection successfull")).catch((e)=>console.log(e))