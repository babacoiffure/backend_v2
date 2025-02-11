import { Router } from "express";
import { authenticateJWT } from "../middleware/auth";
import { authRouter } from "./routes/auth.route";
import { chatRouter } from "./routes/chat.route";
import { clientAppointmentRouter } from "./routes/client-appointment.route";
import { fileUploadRouter } from "./routes/file-upload.route";
import { providerScheduleRouter } from "./routes/provider-schedule.route";
import { providerServiceRouter } from "./routes/provider-service.route";
import { userRestrictionRouter } from "./routes/user-restriction.route";
import { userRouter } from "./routes/user.route";

const rootRouter = Router();

// V1 Router
const v1Router = Router();

v1Router.use("/auth", authRouter);
v1Router.use("/user", userRouter);
v1Router.use("/user-restriction", userRestrictionRouter);
v1Router.use("/provider-service", providerServiceRouter);
v1Router.use("/file-upload", fileUploadRouter);
v1Router.use("/chat", chatRouter);
v1Router.use("/provider-schedule", providerScheduleRouter);
v1Router.use("/appointment", clientAppointmentRouter);
// health check
v1Router.get("/health-check", (req, res) => {
    res.status(200).json({
        success: true,
        status: "OK",
    });
});

// Register version specific router
rootRouter.use("/api/v1", authenticateJWT, v1Router);
export default rootRouter;
