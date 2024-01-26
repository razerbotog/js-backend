import mongoose from "mongoose";

// represents the schema for an individual order item.
const orderItemSchema = new mongoose.Schema({
    productId: {type: mongoose.Schema.Types.ObjectId, ref: "Product"},
    quantity: {type: Number, required: true}
})

const orderSchema = new mongoose.Schema({
    orderPrice: {type: Number, required: true},
    customer: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    orderItems: {type: [orderItemSchema]}, // An array of order items, each following the orderItemSchema.
    address: {type: String, required: true},
    status: {type: String, enum: ["PENDING", "CANCELLED", "DELIVERED"]} //Used the enum validator, which restricts the possible values that the status field can have
}, {timestamps: true})

export const Order = mongoose.model("Order", orderSchema)