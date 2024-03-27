import mongoose, {Schema} from "mongoose";

const subscriptionSchema = new Schema({
    subscriber: {
        type: Schema.Types.ObjectId, // one who is subscribing
        ref: "User"
    },
    channel: {
        type: Schema.Types.ObjectId, // one to whom is subscriber is subscribing
        ref: "User"
    }

}, {timestamps: true})

export const Subscription = mongoose.model("Subscription", subscriptionSchema)

// For Personal Understanding
// When a user hit a subscribe button on another users profile page (channel), it will create a new instance of (document) this model every time
// If we want to get `Total subscriber` of a channel we will match how many documents is  having the same channel name in channel property in  subscription model.
// If we want to get how many total channel is subscribing by a user. Then we have to match how many documents is  having  the name of the user in subscriber property in  subscription model. 