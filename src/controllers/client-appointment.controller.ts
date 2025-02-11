import { appointmentEvents } from "../constants/ws-events";
import ClientAppointment from "../database/models/ClientAppointment";
import User from "../database/models/User";
import { handleAsyncHttp } from "../middleware/controller";
import { socketServer } from "../server";
import { sendUserNotification } from "../service/notification.service";
import queryHelper from "../utils/query-helper";
import { getDayMatchQuery } from "../utils/utils";

export const handleMakeClientAppointment = handleAsyncHttp(async (req, res) => {
    const isExists = await ClientAppointment.findOne({
        scheduleDate: getDayMatchQuery(req.body.scheduleDate),
        timePeriod: req.body.timePeriod,
    });
    if (isExists) {
        res.error("The timePeriod of this schedule already taken.", 400);
    }

    const provider = await User.findById(isExists?.providerId);
    const appointmentMode = provider?.providerSettings?.appointmentMode;
    if (appointmentMode === "Pre-deposit") {
        // check the token give in req.body. and after payment we will save the payment record in payment model. and we give a trx token. we have to validate this trx token here
    }
    const appointment = await ClientAppointment.create({
        status: appointmentMode === "Confirmation" ? "Pending" : "Accepted",
    });
    await sendUserNotification(
        appointment.clientId.toString(),
        "Appointment created",
        appointment
    );
    await sendUserNotification(
        appointment.providerId.toString(),
        "You have a new appointment",
        appointment
    );
    res.success("Appointment created", appointment);
});

export const handleProposeForRescheduleAppointment = handleAsyncHttp(
    async (req, res) => {
        const { id, proposal } = req.body;
        const appointment = await ClientAppointment.findById(id);
        if (!appointment) {
            return res.error("No appointment", 400);
        }
        appointment.rescheduleProposals.push(proposal);
        await appointment.save();
        //TODO: have to check for insertion
        console.log(appointment);
        if (proposal.from === "Provider") {
            await sendUserNotification(
                appointment.providerId.toString(),
                "New reschedule proposal for appointment",
                appointment
            );
        } else {
            await sendUserNotification(
                appointment.clientId.toString(),
                "New reschedule proposal for appointment",
                appointment
            );
        }
        socketServer.emit(
            appointmentEvents.sendAppointmentRescheduleProposal(
                appointment._id.toString()
            ),
            appointment
        );
        res.success("Proposal sent", appointment);
    }
);
export const handleAcceptLastProposalForRescheduleAppointment = handleAsyncHttp(
    async (req, res) => {
        let appointment = await ClientAppointment.findById(req.body.id);
        if (!appointment) {
            return res.error("No appointment", 400);
        }
        const lastProposal =
            appointment.rescheduleProposals[
                appointment.rescheduleProposals.length - 1
            ];
        // if(lastProposal.from === "Provider" && req.headers.userId !== appointment.providerId.toString()){

        // }
        appointment.scheduleDate = lastProposal.scheduleDate;
        appointment.timePeriod = lastProposal.timePeriod;
        await appointment.save();
        //TODO: have to check for insertion
        console.log(appointment);
        socketServer.emit(
            appointmentEvents.appointmentProposalAccept(
                appointment._id.toString()
            ),
            appointment
        );
        res.success("proposal accepted", appointment);
    }
);

export const handleAcceptAppointment = handleAsyncHttp(async (req, res) => {
    //TODO: check provider or client
    let appointment = await ClientAppointment.findById(req.body.id);
    if (!appointment || appointment?.status === "Accepted") {
        return res.error("Already accepted");
    }
    appointment.status = "Accepted";
    await appointment.save();
    await sendUserNotification(
        appointment?.clientId.toString(),
        "Appointment accepted",
        appointment
    );
    res.success("Accepted", appointment);
});
export const handleRejectAppointment = handleAsyncHttp(async (req, res) => {
    //TODO: check provider or client
    let appointment = await ClientAppointment.findById(req.params.id);
    if (!appointment || appointment?.status === "Accepted") {
        return res.error("Already accepted");
    }
    await ClientAppointment.findByIdAndDelete(appointment._id);
    await sendUserNotification(
        appointment?.clientId.toString(),
        "Appointment rejected",
        appointment
    );
    res.success("Rejected appointment", appointment);
});

export const handleGetAppointmentList = handleAsyncHttp(async (req, res) => {
    res.success(
        "Appointment list",
        await queryHelper(ClientAppointment, req.query, {
            populate: ["clientId", "providerId"],
        })
    );
});
