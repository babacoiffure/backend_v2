import { Router } from "express";
import {
    handleCreateProviderService,
    handleDeleteProviderService,
    handleGetProviderServiceList,
    handleUpdateProviderService,
} from "../../controllers/provider-service.controller";

export const providerServiceRouter = Router();

providerServiceRouter.post("/create", handleCreateProviderService);
providerServiceRouter.patch("/update/:id", handleUpdateProviderService);
providerServiceRouter.delete("/delete/:id", handleDeleteProviderService);
providerServiceRouter.get("/list", handleGetProviderServiceList);
