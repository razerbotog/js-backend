import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { deleteVideo, getAllVideos, getVideoById, publishVideo, togglePublishStatus, updateVideo } from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const videoRouter = Router()
videoRouter.use(verifyJwt); // Apply verifyJWT middleware to all routes in this file

videoRouter.route("/").get(getAllVideos).post(
    upload.fields([
        {
            name: "video",
            maxCount: 1,
        },
        {
            name: "thumbnail",
            maxCount: 1,
        },
    ]), 
    publishVideo)
    videoRouter.route("/publishVideo").post(publishVideo)

    videoRouter
    .route("/:videoId")
    .get(getVideoById)
    .patch(upload.single("thumbnail"), updateVideo)  
    .delete(deleteVideo)
    
    videoRouter.route("/:videoId/togglePublishStatus").patch(togglePublishStatus);  

export default videoRouter;