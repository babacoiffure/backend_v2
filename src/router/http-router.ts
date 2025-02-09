import { Router } from "express";
import { authenticateJWT } from "../middleware/auth";
import { authRouter } from "./routes/auth.route";
import { userRouter } from "./routes/user.route";

const rootRouter = Router();

// V1 Router
const v1Router = Router();

v1Router.use("/auth", authRouter);
v1Router.use("/user", userRouter);
v1Router.get("/health-check", (req, res) => {
    res.status(200).json({
        success: true,
        status: "OK",
    });
});

// Register version specific router
rootRouter.use("/api/v1", authenticateJWT, v1Router);
export default rootRouter;
