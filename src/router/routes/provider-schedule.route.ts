import { Router } from "express";
import { handleSaveProviderSchedule } from "../../controllers/provider-schedule.controller";

export const providerScheduleRouter = Router();
providerScheduleRouter.post("/user/:userId/save", handleSaveProviderSchedule);
