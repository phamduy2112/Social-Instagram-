import express from "express"
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";
import { addComment, addNewPost, bookmarkPost, deletePost, dislikePost, getAllPost, getCommentsOfPost, getUserPost, likePost } from "../controllers/post.controller.js";

const messageRouter=express.Router()
messageRouter.get('/all',isAuthenticated,getAllPost);
messageRouter.get("/userpost/all",isAuthenticated,getUserPost);
messageRouter.get(":id/like",isAuthenticated,likePost)
messageRouter.get(":id/dislike",isAuthenticated,dislikePost)
messageRouter.post('/addPost',isAuthenticated,upload.single("image"),addNewPost);
messageRouter.post("/:id/comment",isAuthenticated,addComment)
messageRouter.post("/:id/comment/all",isAuthenticated,getCommentsOfPost);
messageRouter.post("/delete/:id",isAuthenticated,deletePost);
messageRouter.post("/:id/bookmark",isAuthenticated,bookmarkPost)
