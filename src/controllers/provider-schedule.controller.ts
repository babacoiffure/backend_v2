import ProviderSchedule from "../database/models/ProviderSchedule";
import User from "../database/models/User";
import { handleAsyncHttp } from "../middleware/controller";

export const handleSaveProviderSchedule = handleAsyncHttp(async (req, res) => {
    const user = await User.findById(req.body.userId);
    if (user?.userType !== "Provider") {
        return res.error("You are not a provider");
    }
    let providerSchedule = await ProviderSchedule.findOne({
        userId: req.params.userId,
    });
    if (!providerSchedule) {
        providerSchedule = await ProviderSchedule.create(req.body);
    } else {
        providerSchedule = await ProviderSchedule.findByIdAndUpdate(
            providerSchedule._id,
            req.body,
            { new: true, runValidators: true }
        );
    }
    res.success("Provider's schedule updated.", providerSchedule);
});

export const handleGetProviderSchedule = handleAsyncHttp(async (req, res) => {
    const schedule = await ProviderSchedule.findOne({
        userId: req.params.userId,
    });
    if (!schedule) {
        return res.error("Not yet saved", 404);
    }
    res.success("Schedule", schedule);
});
