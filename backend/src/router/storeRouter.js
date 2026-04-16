import express from "express";
import storeController from "../controller/storeController.js";
import auth from "../middlewares/auth.js";
import authorize from "../middlewares/authorize.js";
import constants from "../constant/constants.js";

const router = express.Router();

router.post("/create-store", auth, authorize(constants.roles.systemAdministrator), async (req, res) => {
    const { name, email, address, owner_email } = req.body;
    const data = await storeController.createStore({ name, email, address, owner_email });
    res.status(data.status).send(data);
});

router.post("/get-store", auth, authorize(constants.roles.systemAdministrator), async (req, res) => {
    const { filters } = req.body;
    const data = await storeController.getStore({ filters });
    res.status(data.status).send(data);
});

export default router;
