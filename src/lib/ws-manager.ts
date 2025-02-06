import { randomUUID } from "crypto";
import { Event, Server, Socket } from "socket.io";
import { TSocketControllerContext, TSocketEvent } from "../types";

export class WSManager {
    events: TSocketEvent[] = [];

    constructor() {}

    // Register an event and return the instance for chaining
    registerEvent(
        name: string,
        controller: (context: TSocketControllerContext, payload: any[]) => void,
        logger?: (context: TSocketControllerContext, payload: any[]) => void
    ): this {
        this.events.push({ name, controller, logger });
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
