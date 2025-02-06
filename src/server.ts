import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { serverENV } from "./env.server";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { connectDB } from "./db";

const server = express();
const httpServer = createServer(server);
const socketServer = new Server(httpServer, serverENV.socket);
// middleware
server.use(cors(serverENV.cors));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());
server.use(morgan("dev"));

// initializing router

// initializing socket events

function startServer() {
    try {
        // await connectDB();
        httpServer.listen(serverENV.PORT, () => {
            console.log(
                `⚡ Server ::  running on PORT:${serverENV.PORT} in ${serverENV.NODE_ENV} mode`
            );
        });
    } catch (error) {}
}
startServer();
