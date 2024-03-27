import {asyncHandler} from '../utils/asyncHandler.js'
import {apiError} from '../utils/apiError.js'
import {apiResponse} from '../utils/apiResponse.js'
import { Tweet } from '../models/tweet.model.js'
import mongoose, {isValidObjectId} from 'mongoose'

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content} = req.body
    if(!content){
        throw new apiError(400, "Content Required")
    }
    const ownerReferene = req.user
    const tweet = await Tweet.create({
        content,
        // owner: ownerReferene.id
        owner: ownerReferene
    })
    if(!tweet){
        throw new apiError(400, "Something went wrong while creating")
    }
    console.log(tweet.id);
    const postedTweet = await Tweet.findById(tweet.id)
    if(!postedTweet){
        throw new apiError(400, "Something went wrong while fetching the tweet")
    }
    console.log(postedTweet)
    return res
    .status(200)
    .json(new apiResponse(200, postedTweet, "Tweet Posted Successfully"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const ownerId = req.user._id
    if(!ownerId.trim()){
        throw new apiError(400, "Owner Id Required")
    }
    if(!isValidObjectId(ownerId)){
        throw new apiError(400, "Owner Id is not valid format")
    }
    console.log(formatted);
    const tweets = await Tweet.find({ owner: new mongoose.Types.ObjectId(ownerId) })
    // const tweets = await Tweet.aggregate([
    //     {
    //         $match:{
    //             owner: new mongoose.Types.ObjectId(ownerId)
    //         }
    //     }
    // ]) 
    if(!tweets){
        throw new apiError(400, "Something went wrong while fetching the tweets")
    }
    console.log(tweets);

    return res
    .status(200)
    .json(new apiResponse(200, tweets, "Tweets Fetched Successfully"))
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const id = req.params.id
    if(!id){
        throw new apiError(400, "Tweet Id Required")
    }
    const {content} = req.body
    if(!content){
        throw new apiError(400, "Content Required")
    }
    const tweet = await Tweet.findByIdAndUpdate(id, {content: content}, {new: true})

    // by using aggregate
    // const tweet = await Tweet.findByIdAndUpdate.aggregate([
    //     {
    //         $match:{
    //             _id: (tweetId)
    //         }
    //     },
    //     {
    //         $set:{
    //             content: content
    //         }
    //     }
    // ])
    console.log(tweet);
    if(!tweet){
        throw new apiError(400, "Something went wrong while updating the tweet")
    }

})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const id = req.params.id;
    if(!id){
        throw new apiError(400, "Tweet Id Required")
    }
    if(!isValidObjectId(id)){
        throw new apiError(400,  "Invalid format Tweet ID")
    }
    let tweet = await Tweet.findByIdAndDelete(id)
    if (!tweet) {
        throw new apiError(404, 'The tweet does not exist')
    }
    return res.status(200).json(new apiResponse(200, tweet, 'Deleted Successfully!'));
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}