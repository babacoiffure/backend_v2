import { Router } from "express";
import { authRouter } from "./routes/auth.route";
import { userRouter } from "./routes/user.route";
import { authenticateJWT } from "../middleware/auth";

const v1Router = Router();

v1Router.use("/auth", authRouter);
v1Router.use("/user", userRouter);
v1Router.get("/health-check", (req, res) => {
    res.status(200).json({
        success: true,
        status: "OK",
    });
});

const rootRouter = Router();
rootRouter.use("/api/v1", v1Router);
export default rootRouter;
