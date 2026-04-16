import Result from "../constant/result.js";
import constants from "../constant/constants.js";
import messages from "../constant/message.js";
import dashboardService from "../service/dashboardService.js";

class DashboardController {
    async dashboardSummary() {
        const res = new Result();
        const { httpStatus } = constants;

        try {
            const data = await dashboardService.getDashboardSummary();
            res.status = httpStatus.success;
            res.message = messages.dashboardSummaryFetchedSuccessfully;
            res.data = data;
            return res;
        } catch (err) {
            res.status = httpStatus.serverError;
            res.message = err.message || messages.unableToSignup;
            return res;
        }
    }
}

export default new DashboardController();