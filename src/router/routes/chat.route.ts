import { Router } from "express";
import {
    handleDeleteChatMessage,
    handleGetChatList,
    handleGetChatMessageList,
    handleSendChatMessage,
} from "../../controllers/chat.controller";

export const chatRouter = Router();

chatRouter.get("/list", handleGetChatList);
chatRouter.get("/message/list", handleGetChatMessageList);
chatRouter.post("/send-message", handleSendChatMessage);
chatRouter.patch("/edit-message/:chatId/:messageId", handleSendChatMessage);
chatRouter.delete(
    "/delete-message/:chatId/:messageId",
    handleDeleteChatMessage
);
