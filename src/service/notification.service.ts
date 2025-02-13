import { notificationEvents } from "../constants/ws-events";
import UserNotification from "../database/models/UserNotification";
import { socketServer } from "../server";

export const sendUserNotification = async (
    userId: string,
    title: string,
    data: Record<string, any> = {}
) => {
    const notification = await UserNotification.create({
        title,
        userId,
        data,
    });
    socketServer.emit(
        notificationEvents.sendUserNotification(userId),
        notification
    );
};
export const updateUserNotification = async (
    id: string,
    update: Record<string, any>
) => {
    let notification = await UserNotification.findById(id);
    if (!notification) {
        throw new Error("No notification found");
    }
    await UserNotification.findByIdAndUpdate(id, update, {
        new: true,
        runValidators: true,
    });

    socketServer.emit(
        notificationEvents.sendUserNotificationUpdate(
            notification.userId as string
        ),
        await UserNotification.findById(id)
    );
};
