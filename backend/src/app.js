import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './router/authRouter.js';
import userRouter from './router/userRouter.js';
import storeRouter from './router/storeRouter.js';
import dashboardRouter from './router/dashboardRouter.js';
import './modals/index.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());


app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/store", storeRouter);
app.use("/api/admin", dashboardRouter);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.error(`Server listen at http://localhost:${PORT}`)
});