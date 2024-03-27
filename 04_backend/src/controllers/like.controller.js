import { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler";
import { apiResponse } from "../utils/apiResponse";
import { apiError } from "../utils/apiError";
import {Like} from "../models/like.model.js"
import {Video} from "../models/video.model.js"
import {Tweet} from "../models/tweet.model.js"
import {Comment} from "../models/comment.model.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    if (!videoId) {
        throw new apiError(400, "Video Id is required")
    }
    if (!isValidObjectId(videoId)) {
        throw new apiError(400 ,"Video Id is not valid object id format")
    }
    const video = await Video.findById(videoId)
    if (!video) {
        throw new apiError(400, "Video not found")
    }
    const existingLike = await Like.findOne({
        video: videoId,
        likeBy: req.user?._id
    })
    if(existingLike){
        const removeLike = await Like.findByIdAndDelete(existingLike._id)
        return res
        .status()
        .json(new apiResponse(200, removeLike, "delete/remove like successfully"))
    }else{
        const addLike = await Like.create({
            video: videoId,
            likeBy: req.user?._id
        })
        return res
        .status(200)
        .json(new apiResponse(200, addLike, "Created/Added like successfully"))
    }

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    if (!commentId) {
        throw new apiError(400, "Comment Id Required")
    }
    if (!isValidObjectId(commentId)) {
        throw new apiError(400, "Comment Id is not valid object id")
    }
    const comment = await Comment.findById(commentId)
    if (!comment) {
        throw new apiError(404, "Comment not found")
    }
    const existingLike = await Like.findOne({
        comment: commentId,
        likeBy: req.user?._id
    })
    if(existingLike){
        const removeLike = await Like.findByIdAndDelete(existingLike._id)
        return res
        .status(200)
        .json(new apiResponse(200, removeLike, "delete/remove like successfully"))
    }else{
        const addLike = await Like.create({
            comment: commentId,
             likeBy: req.user?._id
        })
        return res
        .status(200)
        .json(new apiResponse(200, addLike, "Created/Added like successfully"))
    }

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    if (!tweetId) {
        throw new apiError(400, "Tweet Id required")
    }
    if (!isValidObjectId(tweetId)) {
        throw new apiError(400, "Tweet Id is not valid object id format")
    }
    const tweet = await Tweet.findById(tweetId)
    if (!tweet) {
        throw new apiError(400, "Tweet not found")
    }

    const existingLike = await Like.findOne({
        tweet: tweetId,
        likeBy: req.user?._id
    })

    if(existingLike){
        const removeLike = await Like.findByIdAndDelete(existingLike._id)
        return res
        .status(200)
        .json(new apiResponse(200, removeLike, "delete/remove like successfully"))
    }else{
        const addLike = await Like.create({
            tweet: tweetId,
            likeBy: req.user?._id
        })
        return res
        .status(200)
        .json(new apiResponse(200, addLike, "Created/Added like successfully"))
    }

}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const userId = req.user._id
    if(!userId){
    throw new apiError(200, "user id is required")
    }
    if(!isValidObjectId(userId)){
        throw new apiError(200, "user id is not valid object id format")
    }

    // const allLikedVideo =  Like.find({ likeBy: userId }).populate('video');

    const allLikedVideo = Like.aggregate([
        {
            $match: {likeBy: mongoose.Types.ObjectId(userId)} // Filter to get liked videos by the user
        },
        {
            $lookup:{
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "videoInfo" // Alias for the joined documents
            }
        },
        {
            $unwind:"$videoInfo" //// Unwind the array of joined documents
        },

        {
            $lookup: {
                from: "likes",
                localField: "videoInfo._id",
                foreignField: "video",
                as: "likes"
            }
        },
        {
            $addFields:{
                likesCount:{$size: "$likes"} // along with the count of likes each video has
            }
        },
        {
            $project: {
                _id: 1,
                likesCount: '$likesCount',
                likeBy: 1,
                'videoInfo._id': 1,
                'videoInfo.title': 1,
                'videoInfo.description': 1,
                'videoInfo.thumbnail': 1,
                'videoInfo.owner' :1
            }
        }
    ])
    return res
    .status(200)
    .json(200, allLikedVideo, "fetched all liked videos by user")
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}