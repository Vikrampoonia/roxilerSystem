import express from "express";
import authController from "../controller/authController.js";
import auth from "../middlewares/auth.js";
const router = express.Router();

router.post("/logIn", async (req, res) => {
    const { email, password } = req.body;
    const data = await authController.logIn({ email, password });
    res.status(data.status).send(data);
})

router.post("/signUp", async (req, res) => {
    const { name, email, address, password } = req.body;
    const data = await authController.signUp({ name, email, address, password });
    res.status(data.status).send(data);
})

router.post("/logOut", auth, async (req, res) => {
    const data = await authController.logOut({ req });
    res.status(data.status).send(data);
})


export default router;