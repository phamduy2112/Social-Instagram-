import mongoose from "mongoose";
import { timeStamp } from "node:console";

const postSchema=new mongoose.Schema({
    caption:{type:String,default:''},
    image:{type:String,required:true},
    author:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    likes:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
    comments:[{type:mongoose.Schema.Types.ObjectId,ref:"Comment"}],

},{timeStamp:true})
export const Post=mongoose.model("Post",postSchema)