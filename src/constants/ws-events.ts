export const chatEvents = {
    chatNewMessage: (chatId: string) => `chat/new-message/${chatId}`,
    chatMessageUpdated: (chatId: string) => `chat/message-update/${chatId}`,
    chatMessageDeleted: (chatId: string) => `chat/message-deleted/${chatId}`,
};
