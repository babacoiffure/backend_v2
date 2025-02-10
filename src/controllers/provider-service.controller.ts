import ProviderService from "../database/models/ProviderService";
import { handleAsyncHttp } from "../middleware/controller";

export const handleCreateProviderService = handleAsyncHttp(async (req, res) => {
    // Image upload things
    const data = await ProviderService.create(req.body);
    res.success("Service created", data);
});
