import mongoose, { isValidObjectId } from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {apiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { apiError } from "../utils/apiError.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const {channelId} = req.params
    if (!channelId) {
        throw new apiError(400, 'Channel Id is required')
    }
    if (!isValidObjectId(channelId)) {
        throw new apiError(400, 'Channel Id is not valid id format')
    }
    

     // Retrieve videos for the channel
    let videos = await Video.find({owner: channelId})


    // calculate the total views
    // let totalVideosViews = await videos.reduce((total, videos)=> total + videos.view, 0)
     // another approach by using aggreagate
     let totalVideosViews = await Video.aggregate([
        {
            $match: {owner: channelId}
        },
        {
            $group:{
                _id: null,
                views : {$sum: "$views"} //$views is a reference to a field in the documents of the Video collection in MongoDB.
            }
        }

    ])

    // calculate totalSubscribers
    let totalSubscriber = await Subscription.countDocuments({channel: channelId})

    //calculate totalVideos
    let totalVideos = await Video.countDocuments({owner: channelId})



     // total likes for the channel videos

     /*
    //  1st approach
     const totalLikes = await Like.countDocuments(
        { video: {
             $in: await Video.find(
                { owner: channelId } // Retrieves all video documents owned by the channelId.
                )  // $In operator Constructs an array of video IDs obtained from the video documents.
            } // //  field matches any of the video IDs obtained by $In operator
         }
        ); //Counts the number of Like documents 

     */
    /*
    // 2nd approach
    // let likes= await Like.find({video: { $in: await Video.find({ owner: ownerId }) }})
    // let totalLikes = await likes.reduce((total, likes)=> total + likes.view, 0)
    */

    //3rd approach 
    const totalLikesAggregate = await Like.aggregate([
        {
            $lookup:{
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "videoInfo"
            }
        },
        {
            $match:{
                "videoInfo.owner": mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $group: {
                _id: null,
                totalLikes: {$sum: 1}
            }
        }
    ])
    // Extract the total likes from the aggregate result
    const totalLikes = totalLikesAggregate.length > 0 ? totalLikesAggregate[0].totalLikes : 0;

    return res
    .status(200)
    .json(new apiResponse(200, {totalSubscriber, totalVideos, totalVideosViews, totalLikes},"channel stats fetched successfully"))
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const {channelId} = req.params
    if (!channelId) {
        throw new apiError(400, "Channel id is required")
    }
    if (!isValidObjectId(channelId)) {
        throw new apiError(400, "Channel id is required")
    }

    const videos = await Video.find({owner: channelId})

    return res
    .status(200)
    .json(new apiResponse(200, videos, "Channel video fetched successfully"))
})

export {
    getChannelStats, 
    getChannelVideos
    }