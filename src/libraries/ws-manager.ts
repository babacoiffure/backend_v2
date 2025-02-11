import { randomUUID } from "crypto";
import { Server, Socket } from "socket.io";
import { TSocketControllerContext } from "../types";
import { TSocketEvent } from "../types/index";

export class WSEvents {
    events: TSocketEvent[] = [];
    constructor() {}

    addEvent(
        name: string,
        controller: (context: TSocketControllerContext, payload: any[]) => void,
        logger?: (context: TSocketControllerContext, payload: any[]) => void
    ): this {
        this.events.push({ name, controller, logger });
        return this; // Return the instance for chaining
    }
}

export class WSManager {
    events: TSocketEvent[] = [];
    context: TSocketControllerContext | null = null;
    constructor() {}

    // Register an event and return the instance for chaining
    addEvents(eventPath: string, events: TSocketEvent[]): this {
        this.events = this.events.concat(
            events.map((x) => ({ ...x, name: `${eventPath}${x.name}` }))
        );
        return this; // Return the instance for chaining
    }

    // Initialize the WebSocket server and return the instance for chaining
    initialize(socketServer: Server): this {
        console.log("⚡ WebSocket initialized");

        socketServer.on("connection", (socket: Socket) => {
            console.log(`🐞 ${socket.id} connected!`);

            this.events.forEach((event) => {
                const id = randomUUID();
                const context: TSocketControllerContext = {
                    socket,
                    socketServer: socketServer,
                    name: event.name,
                    request: {
                        id,
                        kind: "websocket",
                    },
                    auth: socket.handshake.headers as any, // Adjust this type based on your auth headers structure
                };
                this.context = context;

                socket.on(event.name, (...payload: any[]) => {
                    event.controller(context, payload);
                    if (event.logger) {
                        event.logger(context, payload);
                    }
                });
            });

            socket.on("disconnect", () => {
                console.log(`🪲  ${socket.id} disconnected\n`);
            });
        });

        return this; // Return the instance for chaining
    }
}
