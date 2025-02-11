import { WSEvents } from "../../libraries/ws-manager";
import { wsManager } from "../socket-manager";

export const chatEvents = new WSEvents();
chatEvents.addEvent("/send", (c) => {
    wsManager.context?.socketServer?.emit("chat", "hello");
});
