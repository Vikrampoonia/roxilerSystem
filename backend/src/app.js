import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './router/authRouter';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());


app.use("/api/auth", authRouter);

const PORT = PROCESS.ENV.PORT || 5001;

app.listen(PORT , () => {
    console.error(`Server listen at http://localhoat:${PORT}`)
});