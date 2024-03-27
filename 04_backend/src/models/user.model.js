import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullname: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String, //cloudinary URL
        required: true,
    },
    coverImage: {
        type: String, //cloudinary URL
    },
    watchHistory: [{
        type: Schema.Types.ObjectId,
        ref: "Video"
    }],
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    refreshToken:{
        type:String
    }
}, {timestamps: true})

userSchema.pre("save",  async function(next){
    if(!this.isModified("password")) return next()
    this.password =  await bcrypt.hash(this.password, 10)
    next()
}) // a Mongoose middleware function for the "save" hook on a user schema. This middleware is executed before saving a user instance to the database, and its purpose is to hash the user's password using bcrypt before saving it.

userSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password, this.password) //a custom method added to your Mongoose schema. This method is designed to check if a provided password matches the hashed password stored in the user document.
}



// The generateAccessToken and generateRefreshToken methods you've posted are responsible for generating JSON Web Tokens (JWTs) for authentication purposes. These tokens can be used to identify and authenticate users.
userSchema.methods.generateAccessToken = function (){
    return jwt.sign(
        {
            _id: this._id,
        email: this.email,
        username: this.username,
        fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:  process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function (){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:  process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
export const User = mongoose.model("User",  userSchema);