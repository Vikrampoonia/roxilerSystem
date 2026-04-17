import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

dotenv.config({ path: './src/.env', quiet: true });
const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5001;

const startServer = async () => {
    try {
        const { default: authRouter } = await import('./router/authRouter.js');
        const { default: userRouter } = await import('./router/userRouter.js');
        const { default: storeRouter } = await import('./router/storeRouter.js');
        const { default: dashboardRouter } = await import('./router/dashboardRouter.js');
        const { default: sequelize } = await import('./config/db.js');
        await import('./modals/index.js');

        app.use('/api/auth', authRouter);
        app.use('/api/user', userRouter);
        app.use('/api/store', storeRouter);
        app.use('/api/admin', dashboardRouter);

        await sequelize.authenticate();
        await sequelize.sync();
        console.log('Database tables synced successfully.');

        app.listen(PORT, () => {
            console.error(`Server listen at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
};

startServer();