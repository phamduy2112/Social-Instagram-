import express from "express"
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { addComment, addNewPost, bookmarkPost, deletePost, dislikePost, getAllPost, getCommentsOfPost, getUserPost, likePost } from "../controllers/post.controller.js";
import upload from "../middlewares/multer.js";

const postRouter=express.Router()
postRouter.get('/all',isAuthenticated,getAllPost);
postRouter.get("/userpost/all",isAuthenticated,getUserPost);
postRouter.get("/:id/like",isAuthenticated,likePost)
postRouter.get("/:id/dislike",isAuthenticated,dislikePost)
postRouter.post('/addPost',isAuthenticated,upload.single("image"),addNewPost);
postRouter.post("/:id/comment",isAuthenticated,addComment)
postRouter.post("/:id/comment/all",isAuthenticated,getCommentsOfPost);
postRouter.delete("/delete/:id",isAuthenticated,deletePost);
postRouter.post("/:id/bookmark",isAuthenticated,bookmarkPost)
export default postRouter