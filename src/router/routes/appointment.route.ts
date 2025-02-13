import { Router } from "express";
import {
    handleAcceptAppointment,
    handleAcceptRescheduleProposalOfAppointment,
    handleGetAppointmentList,
    handleMakeAppointment,
    handleProposeForRescheduleAppointment,
    handleRejectAppointment,
} from "../../controllers/appointment.controller";

export const appointmentRouter = Router();

appointmentRouter.get("/list", handleGetAppointmentList);
appointmentRouter.post("/make", handleMakeAppointment);
appointmentRouter.post("/accept", handleAcceptAppointment);
appointmentRouter.post("/reject", handleRejectAppointment);
appointmentRouter.post(
    "/propose-reschedule",
    handleProposeForRescheduleAppointment
);
appointmentRouter.post(
    "/accept-reschedule-proposal",
    handleAcceptRescheduleProposalOfAppointment
);
