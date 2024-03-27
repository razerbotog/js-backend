import { Router } from "express";
import { changeCurrentPassword, getCurrentUser, getUserChannelProfile, getWatchHistory, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route("/register").post(
    //using multer as a middleware before directing to /register to handle files
  // upload.single("avatar"),  // name of the input field in form (<input type="file" name='avatar')
  upload.fields([
    { name: "avatar", maxCount: 1 }, 
    { name: "coverImage", maxCount: 2 },
  ]),// for multiple files use
  registerUser
); 
userRouter.route("/login").post(loginUser)
userRouter.route("/logout").post(verifyJwt, logoutUser)// passing verifyJwt as a middleware to verify user then get user  data
userRouter.route("/refresh-token").post(refreshAccessToken)
userRouter.route("/change-password").post(verifyJwt, changeCurrentPassword)
userRouter.route("/current-user").get(verifyJwt, getCurrentUser) //using get because no info is posting
userRouter.route("/update-account").patch(verifyJwt, updateAccountDetails)
userRouter.route("/avatar").patch( verifyJwt, upload.single("avatar"), updateUserAvatar)
userRouter.route("/cover-image").patch(verifyJwt, upload.single("coverImage") ,updateUserCoverImage)
userRouter.route("/c/:username").get(verifyJwt, getUserChannelProfile)
userRouter.route("/history").get(verifyJwt, getWatchHistory)

// http://localhost:3000/api/v1/users/register
export default userRouter;
