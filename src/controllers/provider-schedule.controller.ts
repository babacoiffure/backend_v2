import ProviderSchedule from "../database/models/ProviderSchedule";
import { handleAsyncHttp } from "../middleware/controller";

export const handleSaveProviderSchedule = handleAsyncHttp(async (req, res) => {
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
