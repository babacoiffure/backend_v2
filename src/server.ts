import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./db";
import { serverConfigs, serverENV } from "./env-config";

import morgan from "morgan";
import { errorMiddleware, handleNotFound } from "./middleware/error";
import rootRouter from "./router/http-router";

const server = express();
const httpServer = createServer(server);
const socketServer = new Server(httpServer, serverConfigs.socket);

// middleware
server.use(
    cors(serverConfigs.cors),
    express.json(),
    express.urlencoded({ extended: true }),
    cookieParser(),
    morgan("dev")
);

// initializing router

server.use(rootRouter, handleNotFound, errorMiddleware);

// initializing socket events

async function startServer() {
    try {
        await connectDB();
        httpServer.listen(serverENV.PORT, () => {
            console.log(
                `⚡ Server ::  running on PORT:${serverENV.PORT} in ${serverENV.NODE_ENV} mode`
            );
        });
    } catch (error) {}
}
startServer();
