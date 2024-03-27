import { Router } from "express";
import { createTweet, deleteTweet, getUserTweets, updateTweet } from "../controllers/tweet.controller.js";
import {verifyJwt} from '../middlewares/auth.middleware.js'
const tweetRouter = Router()
tweetRouter.use(verifyJwt);
tweetRouter.route('/create-tweet').post(createTweet)
tweetRouter.route('/get-user-tweets').get(getUserTweets)
tweetRouter.route('/update-tweet/:id').patch(updateTweet)
tweetRouter.route('/delete-tweet/:id').delete(deleteTweet)


export default tweetRouter