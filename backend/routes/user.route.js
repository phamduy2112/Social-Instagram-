import express from "express"
import { editProfile, followOrUnfollow, getProfile, getSuggestedUsers, login, logout, register } from "../controllers/user.controller.js"
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";

const userRouter=express.Router()
userRouter.post("/register",register)
userRouter.post("/login",login)
userRouter.get("/logout",logout)
userRouter.get("/:id/profile",isAuthenticated,getProfile)
userRouter.get("/suggested",isAuthenticated,getSuggestedUsers)

userRouter.post("/followorunfollow/:id",isAuthenticated,followOrUnfollow);

userRouter.post("/profile/edit",isAuthenticated,upload.single("profilePicture"),editProfile)


export default userRouter