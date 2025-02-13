import { Router } from "express";
import {
    handleDeleteChatMessage,
    handleEditChatMessage,
    handleGetChatByUserIds,
    handleGetChatList,
    handleGetChatMessageList,
    handleSendChatMessage,
} from "../../controllers/chat.controller";

export const chatRouter = Router();

chatRouter.get("/by-ids/:uidPair", handleGetChatByUserIds);
chatRouter.get("/list", handleGetChatList);
chatRouter.get("/message/list", handleGetChatMessageList);
chatRouter.post("/send-message", handleSendChatMessage);
chatRouter.patch("/edit-message/:id", handleEditChatMessage);
chatRouter.delete("/delete-message/:id", handleDeleteChatMessage);
