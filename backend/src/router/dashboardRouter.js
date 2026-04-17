import express from "express";
import dashboardController from "../controller/dashboardController.js";
import auth from "../middlewares/auth.js";
import authorize from "../middlewares/authorize.js";
import constants from "../constant/constants.js";

const router = express.Router();

router.get("/dashboard-summary", auth, authorize(constants.roles.systemAdministrator), async (req, res) => {
    const data = await dashboardController.dashboardSummary();
    res.status(data.status).send(data);
});

router.get("/stats", auth, authorize(constants.roles.systemAdministrator), async (req, res) => {
    const data = await dashboardController.dashboardSummary();
    res.status(data.status).send(data);
});

export default router;