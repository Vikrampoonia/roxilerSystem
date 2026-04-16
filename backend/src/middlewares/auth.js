import jwt from "jsonwebtoken";
import redis from "../config/redis.js";


const auth = async (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
            return res.status(401).send({
                status: 401,
                message: "Authorization token is required",
            });
        }

        const token = authorizationHeader.slice(7).trim();
        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            return res.status(500).send({
                status: 500,
                message: "JWT_SECRET is not configured",
            });
        }

        const isBlacklisted = await redis.get(`blacklist:${token}`);
        if (isBlacklisted) {
            return res.status(401).json({
                message: "This session has ended. Please log in again."
            });
        }

        const decoded = jwt.verify(token, jwtSecret);

        req.user = {
            id: decoded.id,
            name: decoded.name,
            email: decoded.email,
            role: decoded.role,
        };

        next();
    } catch (error) {
        return res.status(401).send({
            status: 401,
            message: error
        });
    }
};

export default auth;
