import { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import {extractPublicId} from 'cloudinary-build-url'

const getAllVideos = asyncHandler(async (req, res) => {
  // GET /api/resource?page=1&limit=10&query=searchTerm&sortBy=date&sortType=asc&userId=123

  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

  // defining a base query in order to push in an object
  let baseQuery = {};

  // if any query pass on the request
  if (query) {
    baseQuery = {
      ...baseQuery,
      //  title: new RegExp(query, "i")// may be we can use this too
      title: { $regex: query, $options: "ig" },
    };
  }

  // we dont need this because user will not search with userId usually
  // checking whether the user id exists or not and pushing it into the base query accordingly
  // if (userId) {
  //     if (!isValidObjectId(userId)) {
  //       throw new ApiError(400, "Invalid userId format");
  //     }
  //     videoQuery = { ...videoQuery, owner: userId };
  //   }

  const sorting1 = sortType === "ascending" ? 1 : -1;
  const sorting2 = sortBy === "date" ? 1 : -1;

  const totalVideos = await Video.countDocuments(baseQuery);
  console.log("totalVideos", totalVideos);

  // Retrieve videos based on pagination, query, and sort
  // here using direct method
  //   const videos = await Video.find(videoQuery)
  //   .sort(sortCriteria)
  //   .skip((page - 1) * limit)
  //   .limit(Number(limit));

  //    here using direct aggregate pipeline
  const videos = await Video.aggregate([
    {
      $match: baseQuery,
    },
    {
      $sort: { title: sorting1, createdAt: sorting2 },
    },
    {
      $limit: Number(limit),
    },
    {
      $skip: (page - 1) * limit,
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    {
      $addFields: {
        avatar: "$owner.avatar",
        fullname: "$owner.fullname",
      },
    },
    {
      $project: {
        videoFile: 1,
        thumbnail: 1,
        title: 1,
        views: 1,
        avatar: 1,
        fullname: 1,
        ownerId: "$owner._id",
      },
    },
  ]);
  return res
    .status(200)
    .json(new apiResponse(200, videos, "Videos Fetched Successfully"));
});

const publishVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const { thumbnailLocalPath } = req.files?.thumbnail[0]?.path;
  const { videoLocalPath } = req.files?.video[0]?.path;
  if (!title || !description || !thumbnailLocalPath || !videoLocalPath) {
    throw new apiError("Please provide all the required fields");
  }
  const thumbnailFile = await uploadOnCloudinary(thumbnailLocalPath);
  const videoFile = await uploadOnCloudinary(videoLocalPath);
  if (!thumbnailFile) {
    throw new apiError("thumbnailFile upload to cloudinary failed");
  }
  if (!videoFile) {
    throw new apiError("videoFile upload to cloudinary failed");
  }

  // creating new video document and saving it in database
  let user = req.user;
  const video = await Video.create({
    videoFile: video.url,
    thumbnail: thumbnail.url,
    title,
    description,
    duration: video.duration || "",
    owner: user,
  });

  let createdVideo = await Video.findById(video._id);
  if (!createdVideo) {
    throw new apiError(
      "Failed To Create A New Video document and saving to db"
    );
  }
  return res
    .status(200)
    .json(new apiResponse(200, createdVideo, "Video Published Successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const videoId = req.params.id;
  if (!videoId.trim()) {
    throw new apiError(401, "need video Id");
  }
  if (!isValidObjectId(videoId)) {
    throw new apiError(401, "Invalid videoId format");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new apiError(404, "Video Not Found");
  }
  const user = await User.findById(req.user?._id).select(
    "-password -refreshToken"
  );
  if (!user) {
    throw new apiError(401, "user id not found");
  }
  user.watchHistory.push(videoId);
  const watchHistory = await user.save({ validateBeforeSave: false });
  if (!watchHistory) {
    throw new apiError(400, "Something went wrong while adding to history");
  }
  video.views += 1;
  const updatedViews = await video.save({ validateBeforeSave: false });

  if (!updatedViews) {
    throw new apiError(400, "Something went wrong while increasing view");
  }

  return res
    .status(200)
    .json(
      new apiResponse(200, video, "Video fetched by video id successfully")
    );
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  // checking videoId
  if (!videoId.trim()) {
    throw new apiError(400, "No video ID provided in the request params.");
  }
  if (!isValidObjectId(videoId)) {
    throw new apiError(400, "Invalid Video Format");
  }

  // checking title, description or thumbnailLocalPath passing in req
  const { title, description } = req.body;
  const thumbnailLocalPath = req.file?.path;
  if (!title && !description && thumbnailLocalPath) {
    throw new apiError(400, "All fields required");
  }
  // Handle thumnail, description and title update if provided
  const updateFields = {};
  if (title) {
    updateFields.title = title;
  }
  if (description) {
    updateFields.description = description;
  }
  
  if (thumbnailLocalPath) {
    // upload new thumbnail On Cloudinary
    const newThumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    //calling db for public url to delete old thumbnail stored in cloudinary
    const video = await Video.findById(videoId).select(
      "-videoFile -title -description -duration -views -isPublised"
    );
      if(!video) throw new apiError(400, "Video not found")

    // updated new url stored updateFields object
    updateFields.thumbnail = newThumbnail.url;

    // delete old thumbnail stored in cloudinary now
    const oldThumbnailUrl = video.thumbnail;
    const publicThumbnailId = extractPublicId(oldThumbnailUrl)
    if(!publicThumbnailId){
      throw new apiError(400, "Error in public thumbnail Id")
    }
    return await deleteOnCloudinary(publicThumbnailId)
  }

 
  
  // now update in db
  const updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    {$set: updateFields},
    {new: true}
    )

  return res
  .status(200)
  .json(new apiResponse(200, updatedVideo,"Updated Successfully"))
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  // checking videoId
  if (!videoId.trim()) {
    throw new apiError(400, "No video ID provided in the request params.");
  }
  if (!isValidObjectId(videoId)) {
    throw new apiError(400, "Invalid Video Format");
  }

  const videoTobeDeleted = Video.findById(videoId)
  const thumbnailUrl = videoTobeDeleted.thumbnail
  const videoFileUrl = videoTobeDeleted.videoFile

  // delete old thumbnail and video stored in cloudinary now
  const publicThumbnailId = extractPublicId(thumbnailUrl)
  const videoThumbnailId = extractPublicId(videoFileUrl)

  const response1 = await deleteOnCloudinary(publicThumbnailId)
  const response2 = await deleteOnCloudinary(videoThumbnailId)
  console.log("response1", response1);
  console.log("response2", response2);

  // now delete from db
  const video = Video.findByIdAndDelete(videoId)
  return res
  .status(200)
  .json(new apiResponse(200, video, "Video Deleted Successfully"))
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const {videoId} = req.params
  if(!videoId){
    throw new apiError(400, "Invalid ID from params")
  }
  if(!isValidObjectId(videoId)){
    throw new apiError(400, "Invalid ID format")
  }

  // below code involves two database operations (read and write),
  // let video = await Video.findById(videoId).select('isPublised')
  // video.isPublished = !video.isPublished
  // await video.save()

  // below code Performs a single atomic update operation
  let video = await Video.findByIdAndUpdate(
    videoId,
      {$set:
        {
          isPublised: !video.isPublised 
        }
      },
      {new : true}
    )

    return res.status(200)
    .json(new apiResponse(200, video, "Publish status toggled"))
});
export { getAllVideos, publishVideo, getVideoById, updateVideo, deleteVideo, togglePublishStatus };
