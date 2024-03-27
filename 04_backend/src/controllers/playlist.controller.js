import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { Video } from "../models/video.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) {
    throw new apiError(400, "All fields required");
  }
  let playlist = await Playlist.create({
    name: name,
    description: description,
    owner: req.user._id,
  });
  if (!playlist) {
    throw new apiError(
      400,
      "Something went wrong  while creating the playlist"
    );
  }
  const createdPlaylist = await Playlist.findById(playlist._id);
  if (!createdPlaylist) {
    throw new apiError(
      400,
      "Something went wrong while saving the playlist to db"
    );
  }
  return res
    .status(200)
    .json(
      new apiResponse(200, createdPlaylist, "Playlist Created succesfully")
    );
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  if (!userId) {
    throw new apiError(400, "user id required");
  }
  if (!isValidObjectId(userId)) {
    throw new apiError(400, "user id not valid object id");
  }
  const userPlaylists = await Playlist.find({ owner: userId });
  if (!userPlaylists) {
    throw new apiResponse(
      401,
      "User playlists fetched failed or has no playlist"
    );
  }
  if (userPlaylists.length === 0) {
    throw new apiResponse(401, "user has no playlists");
  }
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const playlistId = req.params.id;
  if (!playlistId) {
    throw new apiError(400, "Playlist ID is missing in request params");
  }
  if (!isValidObjectId(playlistId)) {
    throw new apiError(400, "Playlist ID is not valid object id");
  }
  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new apiError(400, "Something went wrong while fetching playlist");
  }

  return res
    .status(200)
    .json(new apiResponse(200, playlist, "Playlist Fetched Successfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  if (!playlistId || !videoId) {
    throw new apiError(400, "Both playlist and video ids are needed");
  }
  if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
    throw new apiError(400, "Both IDs are not valid object id");
  }

  let video = await Video.findById(videoId);
  if (!video) {
    throw new apiError(404, "No such video exists!");
  }

  let playlist = await Playlist.findOne(playlistId);
  if (!playlist) {
    throw new apiError(400, "Playlist not found");
  }

  // adding or updating the playlist
  //   this one operates on the in-memory object
  playlist.videos.push(videoId);
  const updatedPlaylist = await playlist.save({ validateBeforeSave: false }); // To save and return the updated playlist without performing validation checks.

  // another approach
  //    this one directly updates the document in the database
  // const updatedPlaylist = await Playlist.findByIdAndUpdate(
  //     playlistId,
  //     { $push: { videos: videoId } },
  //     { new: true } // To return the updated document
  // );

  if (!updatedPlaylist) {
    throw new apiError(
      400,
      "Something went wrong while adding video to the playlist"
    );
  }

  return res
    .status(200)
    .json(new apiResponse(200, updatedPlaylist, "Video added to the playlist"));
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  if (!playlistId || !videoId) {
    throw new apiError(400, "Both playlist and video ids are needed");
  }
  if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
    throw new apiError(400, "Both IDs are not valid object id");
  }

  let video = await Video.findById(videoId);
  if (!video) {
    throw new apiError(404, "No such video exists!");
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new apiError(400, "Playlist not found");
  }

  //   removing video
  // this one operates on the in-memory object
  playlist.videos.pull(videoId);
  const updatedPlaylist = await playlist.save({ validateBeforeSave: false });

  // another approach
  //    this one directly updates the document in the database
  //   const updatedPlaylist = await Playlist.findByIdAndUpdate(
  //     playlistId,
  //     { $pull: { videos: videoId } },
  //     { new: true } // To return the updated document
  //   );

  if (!updatedPlaylist) {
    throw new apiError(
      400,
      "Something went wrong while removing video from the playlist"
    );
  }
  return res
    .status(200)
    .json(
      new apiResponse(200, updatedPlaylist, "Video removed from the playlist")
    );
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  // TODO: delete playlist
  if (!playlistId) {
    throw new apiError(400, "playlist ID required");
  }
  if (!isValidObjectId(playlistId)) {
    throw new apiError(400, "Playlist Id is not valid object id");
  }

  let playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new apiError(404, "Playlist Not Found");
  }

  let deletedPlaylist = await Playlist.findByIdAndDelete(playlistId);
  if (!deletedPlaylist) {
    throw new apiError(
      400,
      "Something went wrong while  deleting the playlist"
    );
  }

//   another approach
  //This method will delete the first document that matches the specified condition
//   const result = await Playlist.deleteOne({ _id: playlistId });
//   if (result.deletedCount === 0) {
//     throw new apiError(404, "Playlist not found");
//   }

  return res
    .status(200)
    .json(
      new apiResponse(200, deletedPlaylist, "Playlist Deleted Successfully")
    );
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;

  if (!playlistId) {
    throw new apiError(400, "Playlist ID is required");
  }
  if (!isValidObjectId(playlistId)) {
    throw new apiError(400, "Playlist ID is not valid object id");
  }
  if (!name || !description) {
    throw new apiError(400, "Name and Description are required fields");
  }

  let playlist = await Playlist.findByIdAndUpdate(playlistId, {name: name, description: description}, {new: true});
  if (!playlist) {
    throw new apiError(400, "Playlist not found")
  }

  return res
  .status(200)
  .json(new apiResponse(200,  playlist, "Playlist updated successfully"));
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
