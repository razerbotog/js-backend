import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const commentSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    video:{
        type : Schema.Types.ObjectId,
        ref: "Video"
    },
    owner:{
        type : Schema.Types.ObjectId,
        ref: "User"
    }
},{timestamps: true})


commentSchema.plugin(mongooseAggregatePaginate) //This plugin is specifically designed to provide pagination support for Mongoose aggregation queries, allowing you to paginate the results of complex aggregation pipelines.
export const Comment = mongoose.model("Comment", commentSchema)