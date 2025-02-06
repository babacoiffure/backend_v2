import { Server, Socket } from "socket.io";
export type TAuthHeaders = {
    x_uid: string;
    x_access_token: string;
    x_device_token: string;
};
export type TSocketControllerContext = {
    socket: Socket;
    socketServer: Server | null;
    name: string;
    request: {
        id: string;
        kind: "websocket" | "http";
    };
    auth?: TAuthHeaders;
};

export type SocketControllerProps = [TSocketControllerContext, payload?: any];

export type TSocketController = (
    context: TSocketControllerContext,
    payload: any
) => void;

export type TSocketEvent = {
    name: string;
    controller: TSocketController;
    logger?: TSocketController;
};

export type TEventRegister = (
    name: string,
    controller: TSocketController,
    logger?: TSocketController
) => void;

export interface GoogleDecodedUser {
    sub: string;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    email: string;
    email_verified: boolean;
}
