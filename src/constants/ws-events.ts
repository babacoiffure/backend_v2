export const chatEvents = {
    chatNewMessage: (chatId: string) => `chat/new-message/${chatId}`,
    chatMessageUpdated: (chatId: string) => `chat/message-update/${chatId}`,
    chatMessageDeleted: (chatId: string) => `chat/message-delete/${chatId}`,
};

export const notificationEvents = {
    sendUserNotification: (userId: string) => `user/notification/${userId}`,
    sendUserNotificationUpdate: (userId: string) =>
        `user/notification-update/${userId}`,
};
