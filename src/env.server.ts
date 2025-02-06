import { CorsOptions } from "cors";
import { ServerOptions } from "socket.io";

type ServerENV = Readonly<{
    PORT: number;
    NODE_ENV: "production" | "development" | "test" | string;
    socket: Partial<ServerOptions>;
    cors?: CorsOptions;
    database: {
        name: string;
        uri: string;
    };
    keys: {
        ACCESS_TOKEN_PRIVATE_KEY: string;
        ACCESS_TOKEN_PUBLIC_KEY: string;
        REFRESH_TOKEN_PUBLIC_KEY: string;
        REFRESH_TOKEN_PRIVATE_KEY: string;
    };
    intervals: {
        ACCESS_TOKEN_EXPIRE_IN: string;
        REFRESH_TOKEN_EXPIRE_IN: string;
    };
}>;

const serverENV: ServerENV = Object.freeze({
    PORT: 9000,
    NODE_ENV: process.env.NODE_ENV ?? "development",
    socket: {
        path: "",
        cors: {
            origin: ["*"],
        },
    },
    cors: {
        origin: "*",
    },
    database: {
        name: "SaloonDB",
        uri: "mongodb://127.0.0.1:27017/saloon_db",
    },
    keys: {
        ACCESS_TOKEN_PRIVATE_KEY: process.env.ACCESS_TOKEN_PRIVATE_KEY ?? "",
        ACCESS_TOKEN_PUBLIC_KEY: process.env.ACCESS_TOKEN_PUBLIC_KEY ?? "",
        REFRESH_TOKEN_PUBLIC_KEY: process.env.REFRESH_TOKEN_PUBLIC_KEY ?? "",
        REFRESH_TOKEN_PRIVATE_KEY: process.env.REFRESH_TOKEN_PRIVATE_KEY ?? "",
    },
    intervals: {
        ACCESS_TOKEN_EXPIRE_IN: process.env.ACCESS_TOKEN_EXPIRE_IN ?? "",
        REFRESH_TOKEN_EXPIRE_IN: process.env.REFRESH_TOKEN_EXPIRE_IN ?? "",
    },
});

export { serverENV };
