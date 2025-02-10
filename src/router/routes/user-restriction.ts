import { Router } from "express";
import {
    handleBlockUser,
    handleGetBlockListByUserId,
    handleGetRestrictionList,
    handleReportUser,
    handleUnBlockUser,
} from "../../controllers/user-restriction.controller";

export const userRestrictionRouter = Router();

userRestrictionRouter.get("/list", handleGetRestrictionList);
userRestrictionRouter.get(
    "/user/:userId/block-list",
    handleGetBlockListByUserId
);
userRestrictionRouter.post("/block", handleBlockUser);
userRestrictionRouter.post("/unblock", handleUnBlockUser);
userRestrictionRouter.post("/report", handleReportUser);
