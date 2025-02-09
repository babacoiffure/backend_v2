import jwt from "jsonwebtoken";
import { serverENV } from "../env";

export function signJwt(
    object: Object,
    privateKey: string,
    options?: jwt.SignOptions | undefined
) {
    return jwt.sign(object, privateKey, {
        ...(options && options),
        algorithm: "RS256",
    });
}

export function verifyJwt(token: string, publicKey: string) {
    try {
        const decoded = jwt.verify(token, publicKey);
        return {
            valid: true,
            expired: false,
            decoded: decoded as { userId: string; userType: string },
        };
    } catch (e: any) {
        return {
            valid: false,
            expired: e.message === "jwt expired",
            decoded: null,
        };
    }
}

export const generateAccessToken = ({
    userId,
    userType,
}: {
    userId: string;
    userType: string;
}) => {
    return signJwt(
        {
            userId,
            userType,
        },
        serverENV.ACCESS_TOKEN_PRIVATE_KEY,
        {
            expiresIn: serverENV.ACCESS_TOKEN_EXPIRE_IN as any,
        }
    );
};
export const verifyAccessToken = (token: string) =>
    verifyJwt(token, serverENV.ACCESS_TOKEN_PUBLIC_KEY);

export const generateRefreshToken = ({
    userId,
    userType,
}: {
    userId: string;
    userType: string;
}) => {
    return signJwt(
        {
            userId,
            userType,
        },
        serverENV.REFRESH_TOKEN_PRIVATE_KEY,
        {
            expiresIn: serverENV.REFRESH_TOKEN_EXPIRE_IN as any,
        }
    );
};
export const verifyRefreshToken = (token: string) =>
    verifyJwt(token, serverENV.REFRESH_TOKEN_PUBLIC_KEY as any);
