import { chatEvents } from "../constants/ws-events";
import Chat from "../database/models/Chat";
import ChatMassage, { getReceiverId } from "../database/models/ChatMassage";
import { handleAsyncHttp } from "../middleware/controller";
import { socketServer } from "../server";
import { sendUserNotification } from "../service/notification.service";
import queryHelper from "../utils/query-helper";
export const handleGetChatByUserIds = handleAsyncHttp(async (req, res) => {
    let chat = await Chat.findOne({ userIds: req.body.chatIds });
    if (!chat) {
        chat = await Chat.create({ userIds: req.body.userIds });
    }
    res.success("Chat conversation", chat);
});

export const handleSendChatMessage = handleAsyncHttp(async (req, res) => {
    const { chatId, content, senderId, type } = req.body;
    const chat = await Chat.findById(chatId);
    if (!chat) {
        return res.error("Chat not found", 404);
    }
    const message = await ChatMassage.create({
        chatId,
        senderId,
        content,
        type,
    });
    socketServer.emit(chatEvents.chatNewMessage(chatId), message);
    // send notification by socket
    let receiverId = getReceiverId(senderId, chat.userIds as any);
    await sendUserNotification(receiverId, "New message", message);
    res.success("message sent", message);
});
export const handleEditChatMessage = handleAsyncHttp(async (req, res) => {
    const message = await ChatMassage.findByIdAndUpdate(
        req.params.messageId,
        req.body
    );
    socketServer.emit(
        chatEvents.chatMessageUpdated(req.params.chatId),
        message
    );
    // send notification by socket
    res.success("message updated", message);
});
export const handleDeleteChatMessage = handleAsyncHttp(async (req, res) => {
    const message = await ChatMassage.findByIdAndDelete(req.params.messageId);
    socketServer.emit(
        chatEvents.chatMessageDeleted(req.params.chatId),
        "deleted"
    );
    // send notification by socket
    res.success("message deleted", message);
});
export const handleGetChatList = handleAsyncHttp(async (req, res) => {
    res.success("Chat list", await queryHelper(ChatMassage, { ...req.query }));
});
export const handleGetChatMessageList = handleAsyncHttp(async (req, res) => {
    res.success(
        "Message list",
        await queryHelper(ChatMassage, { ...req.query })
    );
});
