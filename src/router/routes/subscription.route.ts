import { Router } from "express";
import {
    handleCreateSubscription,
    handleGetSubscriptionList,
    handleGetSubscriptionValidity,
    handleGetUserSubscription,
    handleInactiveSubscription,
    handleUpdateSubscription,
} from "../../controllers/subscription.controller";

export const subscriptionRouter = Router();

subscriptionRouter.get("/has-subscription/:id", handleGetSubscriptionValidity);
subscriptionRouter.get("/user/:id", handleGetUserSubscription);
subscriptionRouter.get("/list", handleGetSubscriptionList);
subscriptionRouter.post("/create", handleCreateSubscription);
subscriptionRouter.post("/update/:id", handleCreateSubscription);
subscriptionRouter.get("/inactive/:id", handleUpdateSubscription);
subscriptionRouter.get("/list", handleInactiveSubscription);
