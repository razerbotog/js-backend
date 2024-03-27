import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const videoSchema = new Schema({
    videoFile: {
        type: String, // Cloudinary Url
        required: true
    },
    thumbnail: {
        type: String, // Cloudinary Url
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: String, // Cloudinary Url
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    isPublised:{
        type: Boolean,
        default: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }

}, {timestamps: true})

videoSchema.plugin(mongooseAggregatePaginate) //This plugin is specifically designed to provide pagination support for Mongoose aggregation queries, allowing you to paginate the results of complex aggregation pipelines.
export const Video = mongoose.model("Video",  videoSchema);