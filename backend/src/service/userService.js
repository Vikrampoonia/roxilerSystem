import bcrypt from "bcryptjs";
import { Op, fn, col } from "sequelize";
import User from "../modals/userModals.js";
import Store from "../modals/storeModals.js";
import Rating from "../modals/ratingModals.js";
import constants from "../constant/constants.js";
import messages from "../constant/message.js";
import { sanitizeUser } from "../utils/sanitizer.js";

class UserService {
    async createUser({ name, email, password, address, role }) {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            throw new Error(messages.emailAlreadyExists);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            address,
            password: hashedPassword,
            role,
        });

        const sanitizedUser = sanitizeUser(user);

        return sanitizedUser;
    }

    async getUser({ filters = {} }) {
        const where = {};

        if (filters.name) {
            where.name = { [Op.iLike]: `%${filters.name}%` };
        }
        if (filters.email) {
            where.email = { [Op.iLike]: `%${filters.email}%` };
        }
        if (filters.address) {
            where.address = { [Op.iLike]: `%${filters.address}%` };
        }
        if (filters.role) {
            where.role = filters.role;
        }

        const pageLimit = Number(filters.pageLimit || 10);
        const page = Number(filters.page || 1);
        const offset = (page - 1) * pageLimit;

        const { rows, count } = await User.findAndCountAll({
            where,
            attributes: { exclude: ["password"] },
            order: [["createdAt", "DESC"]],
            limit: pageLimit,
            offset,
        });

        return {
            list: rows,
            total: count,
            page,
            pageLimit,
            totalPages: Math.ceil(count / pageLimit),
        };
    }

    async getUserById({ userId }) {
        const user = await User.findByPk(userId, {
            attributes: { exclude: ["password"] },
        });

        if (!user) {
            throw new Error(messages.userNotFound);
        }

        const userData = sanitizeUser(user);

        if (userData.role !== constants.roles.storeOwner) {
            return userData;
        }

        const store = await Store.findOne({
            where: { owner_id: userId },
            attributes: {
                include: [[fn("COALESCE", fn("AVG", col("Ratings.rating_value")), 0), "storeRating"]],
            },
            include: [
                {
                    model: Rating,
                    attributes: [],
                    required: false,
                },
            ],
            group: ["Store.id"],
        });

        return {
            ...userData,
            storeRating: store ? Number(store.getDataValue("storeRating")) : 0,
        };
    }

    async updateProfile({ userId, name, address, password }) {
        const user = await User.findByPk(userId);

        if (!user) {
            throw new Error(messages.userNotFound);
        }

        const updateData = {};

        if (name) {
            updateData.name = name;
        }

        if (address) {
            updateData.address = address;
        }

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        await user.update(updateData);

        const sanitizedUser = sanitizeUser(user);

        return sanitizedUser;
    }
}

export default new UserService();
