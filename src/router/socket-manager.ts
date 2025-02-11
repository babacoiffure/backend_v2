import { WSManager } from "../libraries/ws-manager";
import { chatEvents } from "./events/chat.event";

export const wsManager = new WSManager();

wsManager.addEvents("chat", chatEvents.events);
