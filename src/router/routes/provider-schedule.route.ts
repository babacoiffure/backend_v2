import { Router } from "express";
import {
    handleGetProviderSchedule,
    handleSaveProviderSchedule,
} from "../../controllers/provider-schedule.controller";

export const providerScheduleRouter = Router();
providerScheduleRouter.get("/user/:userId", handleGetProviderSchedule);
providerScheduleRouter.post("/save", handleSaveProviderSchedule);
