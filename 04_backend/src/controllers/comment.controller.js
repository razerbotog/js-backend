import mongoose, { isValidObjectId } from "mongoose"
import {Comment} from "../models/comment.model.js"
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    if(!videoId){
        throw new apiError(400, "Video Id is required")
    }
    if(!isValidObjectId(videoId)){
        throw new apiError(400, "Video Id is not valid object id format")
    }
    if(!page || !limit){
        throw new apiError(400, "page & limit from query needed")
    }

    const video = await Video.findById(videoId)
    if(!video){
        new apiError(404, "Video not found")
    }

    // finding comment documents where video field is match with above videoId 
    // const comment = await Comment.find({}).limit().skip()
    const comment = await Comment.aggregate([
        {
            $match:{
                video: mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $limit: limit
        },
        {
            $skip: (page - 1)*1 // by multiplying 1 converting the result to a numeric value
        }
    ])
    return res
    .status(200)
    .json(new apiResponse(200, comment, "All comments fetched successfully"))

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {content} = req.body
    const owner = req.user?._id
    const { videoId } = req.params;

    if (!content) {
       throw new apiError(400, "content is required") 
    }
    if (!owner) {
       throw new apiError(400, "owner id is required") 
    }
    if (!videoId) {
        throw new apiError(400, "video id is required")
    }
    if (!isValidObjectId(videoId)) {
        throw new apiError(400, "video id is not valid object id format")
    }
    const comment = await Comment.create({
        content,
        video: videoId,
        owner
    })
    if(!comment){
        throw new apiError(400, "Something went wrong while creating a comment")
    }
    return res.status(200).json(new apiResponse(200, comment, "Comment created successfully"))
})

const updateComment = asyncHandler(async (req, res) => {
   const {commentId} = req.params
   const {content} = req.body
    if (!commentId) {
        throw new apiError(400, "video id is required")
    }
    if (!isValidObjectId(commentId)) {
        throw new apiError(400, "video id is not valid object id format")
    }
    if (!content) {
        throw new apiError(400, "content is required") 
     }

    const comment = await Comment.findByIdAndUpdate(commentId, { content }, {new: true})
    if(!comment){
        throw new apiError(400, "Something went wrong while updating a comment")
    }
    return res.status(200).json(new apiResponse(200, comment, "Comment updated successfully"))
})

const deleteComment = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    if (!commentId) {
        throw new apiError(400, "video id is required")
    }
    if (!isValidObjectId(commentId)) {
        throw new apiError(400, "video id is not valid object id format")
    }
    const comment = await Comment.findByIdAndDelete(commentId)
    if(!comment){
        throw new apiError(400, "Something went wrong while updating a comment")
    }
    return res.status(200).json(new apiResponse(200, comment, "Comment deleted successfully"))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }