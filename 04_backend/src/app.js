import express from "express";
import cors from 'cors'
import cookieParser from "cookie-parser";

const app = express();

// for cors origin
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

// for upcoming data from forms
app.use(express.json({limit:  '16kb'})); // to support JSON-encoded bodies . In some case we use pakage like body-parser, now a method "express.json()" is available in express itself

// for upcoming data from url
app.use(express.urlencoded({extended: true, limit: "16kb"}))

//to store public assets in my app
app.use(express.static("public")) // public is folder name

// to opertate CRUD of cookie in client browser
app.use(cookieParser())

//routes
import  userRouter from "./routes/user.routes.js"
app.use('/api/v1/users', userRouter) // not using app.get because routes are in different file. So using middleware

import videoRouter from "./routes/video.routes.js";
app.use("/api/v1/videos", videoRouter)

import tweetRouter from "./routes/tweet.routes.js";
app.use("/api/v1/tweets", tweetRouter)

export { app };
