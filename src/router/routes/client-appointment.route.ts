import { Router } from "express";
import {
    handleAcceptAppointment,
    handleGetAppointmentList,
    handleMakeClientAppointment,
    handleProposeForRescheduleAppointment,
} from "../../controllers/client-appointment.controller";

export const clientAppointmentRouter = Router();

clientAppointmentRouter.get("/list", handleGetAppointmentList);
clientAppointmentRouter.post("/make", handleMakeClientAppointment);
clientAppointmentRouter.post("/accept", handleAcceptAppointment);
clientAppointmentRouter.post(
    "/propose-reschedule",
    handleProposeForRescheduleAppointment
);
clientAppointmentRouter.post(
    "/accept-reschedule-proposal",
    handleProposeForRescheduleAppointment
);
clientAppointmentRouter.post(
    "/reject-reschedule-proposal",
    handleProposeForRescheduleAppointment
);
