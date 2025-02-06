import { WSManager } from "../lib/ws-manager";
import { socketServer } from "../server";

export const wsManagerV1 = new WSManager();
wsManagerV1.registerEvent("hello", ({ name, socket }, [data, cb]) => {
    cb({
        reply: "Hi",
    });
});
