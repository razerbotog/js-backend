import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const channelId = req.params.id;
  // TODO: toggle subscription
  if (!channelId) throw new apiError(400, "channel ID required");
  if (!isValidObjectId(channelId))
    throw new apiError(400, "Invalid format channel ID");

  if (channelId.toString() === req.user._id.toString()) {
    throw new apiError(400, "You cannot subscribe to yourself");
  }
  const existedSubscriber = await Subscription.findOne({
    channel: channelId,
    subscriber: req.user._id,
  });

  // Use aggregate with $lookup when you need to fetch additional information about the subscriber, such as subscriber details from the "users" collection.
  // const existedSubscriber = await Subscription.aggregate([
  //     {
  //         $match:{
  //             channel: channelId
  //         },
  //         $lookup:{
  //             from: "users",
  //             localField: "subscriber",
  //             foreignField: "_id",
  //             as: "subscribers"
  //         }
  //     }
  // ])

  if (existedSubscriber) {
    // If subscription exists, delete it
    const subscription = await Subscription.findByIdAndDelete(
      existedSubscriber._id
    );
    return res
      .status(200)
      .json(new apiResponse(200, subscription, "Unsubscribe Successfully"));
  } else {
    // If subscription doesn't exist, create it
    const subscription = await Subscription.create({
      channel: channelId,
      subscriber: req.user._id,
    });
    if (!subscription) {
        throw new apiError(401, "Something went wrong while creating");
      }
    const subscribedUser = await Subscription.findOne({
      channel: channelId,
      subscriber: req.user._id,
    });
    if (!subscribedUser) {
      throw new apiError(401, "Something went wrong while finding in db");
    }
    return res
      .status(200)
      .json(
        new apiResponse(200, subscribedUser, "Channel Subscribed Successfully!")
      );
  }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const channelId = req.params.id;
  if (!channelId?.trim()) {
    throw new apiError(401, "Channel Id required")
  }
  if (!isValidObjectId(channelId)) {
    throw new apiError(401, "Channel is not valid object id")
  }
  const subscribers = await Subscription.find({channel: channelId})

  //incase to retrieve subscriber information.
  // const subscribers = await Subscription.aggregate([
  //   {
  //     $match:{
  //       channel: channelId
  //     }
  //   },
  //   {
      
  //       $lookup: {
  //         from: "users",
  //         localField: "subscriber",
  //         foreignField: "_id",
  //         as : "subscribers"
  //       }
      
  //   }
    
  // ])

  if (!subscribers) {
    throw  new apiError(400, "No subscribed User Found in this Channel");
  }
  return res
  .status(200)
  .json(new apiResponse(200, subscribers, "Successfully fetched subscriber list of a channel"))
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const subscriberId = req.params.id;
  if (!subscriberId?.trim) {
    throw new apiError(400, "Subscriber Id Required")
  }
  if (!isValidObjectId(subscriberId)) {
    throw new apiError(400, "Subscriber Id is not valid object id")
  }
  // directly fetches documents from the collection without aggregation.
  const  subscribedChannels = await Subscription.find({ subscriber: subscriberId })

  // fetches documents from the collection with aggregation.
  // const  subscribedChannels = await Subscription.aggregate([
  //   {
  //     $match: {
  //       subscriber: subscriberId
  //     }
  //   },
  //   {
  //     $lookup:{
  //       from: "subscriptions",
  //       localField: "channel",
  //       foreignField: "_id",
  //       as: "channels"
  //     }
  //   }
  // ])
  if(!subscribedChannels){
    return res
    .status(200)
    .json(new apiResponse(200, subscribedChannels, "User has not subscribed to any channels"));
  }else{
    return res
    .status(200)
    .json(new apiResponse(200, subscribedChannels, "All subscribed channels fetched successfully"));
  }
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
