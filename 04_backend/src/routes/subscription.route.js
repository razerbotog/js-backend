import { Router } from "express";
import {verifyJwt} from "../middlewares/multer.middleware.js"
import { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels } from "../controllers/subscription.controller.js";

const subscriptionRouter = Router()
subscriptionRouter.use(verifyJwt)

subscriptionRouter.route("/toggle-subscription/:id").post(toggleSubscription).get(getUserChannelSubscribers)
subscriptionRouter.route("/get-subscribed-channels/:id").get(getSubscribedChannels)