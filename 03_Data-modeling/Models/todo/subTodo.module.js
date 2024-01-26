import mongoose from "mongoose";

const subTodoSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    complete: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,  // Reference to the user who created this
        // Todo item - stored as a MongoDB Object ID
        ref: 'User'                   // The model that this references
    }
}, {timestamps: true})


export const SubTodo = mongoose.model("SubTodo", subTodoSchema)