import User from '../modals/userModals.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import redis from '../config/redis.js';

class AuthService {

    async logIn({ email, password }) {
        const user = await User.findOne({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new Error('Invalid credentials');
        }
        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
        const accessToken = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return { user, accessToken };
    }

    async signUp({ userData }) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        return await User.create({ ...userData, password: hashedPassword });
    }

    async logOut({ req }) {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(' ')[1];

        if (!token) {
            throw new Error("No token provided");
        }

        // Decode token to get remaining life
        const decoded = jwt.decode(token);
        if (!decoded?.exp) {
            return { success: true };
        }
        const now = Math.floor(Date.now() / 1000);
        const ttl = decoded.exp - now; // Remaining seconds

        if (ttl > 0) {
            // Store token in Redis with calculated TTL
            await redis.setex(`blacklist:${token}`, ttl, 'true');
        }

        return { success: true };
    }
}

export default new AuthService();