import UserRestriction from "../database/models/UserRestriction";
import { handleAsyncHttp } from "../middleware/controller";
import queryHelper from "../utils/query-helper";

export const handleBlockUser = handleAsyncHttp(async (req, res) => {
    const { from, to } = req.body;
    let restriction = await UserRestriction.findOne({
        from,
        to,
        actionType: "Block",
    });
    if (restriction) {
        return res.error("Already blocked", 400);
    }
    restriction = await UserRestriction.create({
        from,
        to,
        actionType: "Block",
    });
    res.success("Blocked.", null, 200);
});
export const handleUnBlockUser = handleAsyncHttp(async (req, res) => {
    const { from, to } = req.body;
    let restriction = await UserRestriction.findOne({
        from,
        to,
        actionType: "Block",
    });
    if (!restriction) {
        return res.error("Not blocked yet.", 400);
    }
    restriction = await UserRestriction.findByIdAndDelete(restriction._id);
    res.success("Unblocked.");
});

export const handleGetBlockListByUserId = handleAsyncHttp(async (req, res) => {
    const list = await queryHelper(UserRestriction, {
        ...req.query,
        from: req.params.userId,
        actionType: "Block",
    });
    res.success("User block list", list);
});

export const handleGetRestrictionList = handleAsyncHttp(async (req, res) => {
    const list = await queryHelper(UserRestriction, req.query);
    res.success("User Restriction list", list);
});
export const handleReportUser = handleAsyncHttp(async (req, res) => {
    const { from, to, reason, note } = req.body;
    await UserRestriction.create({
        from,
        to,
        actionType: "Report",
        report: {
            reason,
            note,
        },
    });
    res.success("Reported.");
});
