import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
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
    },
    subTodos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'SubTodo'
        }
    ] //Array of subtodos
}, {timestamps: true})

export const Todo = mongoose.model("Todo", todoSchema)