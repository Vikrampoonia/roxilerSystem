import express from "express";
import userController from "../controller/userController.js";
import auth from "../middlewares/auth.js";
import authorize from "../middlewares/authorize.js";
import constants from "../constant/constants.js";
const router = express.Router();

router.post("/create-user", auth, authorize(constants.roles.systemAdministrator), async (req, res) => {
    const { name, email, password, address, role } = req.body;
    const data = await userController.createUser({ name, email, password, address, role });
    res.status(data.status).send(data);
});

router.get("/get-user", auth, authorize(constants.roles.systemAdministrator), async (req, res) => {
    const { filters } = req.query;
    const data = await userController.getUser({ filters });
    res.status(data.status).send(data);
});

router.get("/get-user/:id", auth, authorize(constants.roles.systemAdministrator), async (req, res) => {
    const { id } = req.params;
    const data = await userController.getUserById({ userId: id });
    res.status(data.status).send(data);
});

router.put("/update-profile", auth, async (req, res) => {
    const { name, address, password } = req.body;
    const userId = req.user.id;
    const data = await userController.updateProfile({ userId, name, address, password });
    res.status(data.status).send(data);
});

export default router;