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
        const sortBy = filters.sortBy || "createdAt";
        const sortOrder = (filters.sortOrder || "desc").toUpperCase();

        const { rows, count } = await User.findAndCountAll({
            where,
            attributes: { exclude: ["password"] },
            order: [[sortBy, sortOrder]],
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
        });

        if (!store) {
            return {
                ...userData,
                storeRating: 0,
            };
        }

        const ratingRow = await Rating.findOne({
            where: { store_id: store.id },
            attributes: [[fn("COALESCE", fn("AVG", col("rating_value")), 0), "storeRating"]],
            raw: true,
        });

        return {
            ...userData,
            storeRating: Number(ratingRow?.storeRating || 0),
        };
    }

    async getProfile({ userId }) {
        const user = await User.findByPk(userId, {
            attributes: { exclude: ["password"] },
        });

        if (!user) {
            throw new Error(messages.userNotFound);
        }

        return sanitizeUser(user);
    }

    async addRating({ userId, storeId, ratingValue }) {
        const store = await Store.findByPk(storeId);
        if (!store) {
            throw new Error(messages.storeNotFound);
        }

        const existingRating = await Rating.findOne({
            where: {
                user_id: userId,
                store_id: storeId,
            },
        });

        if (existingRating) {
            throw new Error(messages.ratingAlreadySubmitted);
        }

        return await Rating.create({
            user_id: userId,
            store_id: storeId,
            rating_value: ratingValue,
        });
    }

    async updateRating({ userId, storeId, ratingValue }) {
        const existingRating = await Rating.findOne({
            where: {
                user_id: userId,
                store_id: storeId,
            },
        });

        if (!existingRating) {
            throw new Error(messages.ratingNotFound);
        }

        await existingRating.update({ rating_value: ratingValue });
        return existingRating;
    }

    async getStoreForUser({ userId, filters = {} }) {
        const where = {};

        if (filters.name) {
            where.name = { [Op.iLike]: `%${filters.name}%` };
        }

        if (filters.address) {
            where.address = { [Op.iLike]: `%${filters.address}%` };
        }

        const pageLimit = Number(filters.pageLimit || 10);
        const page = Number(filters.page || 1);
        const offset = (page - 1) * pageLimit;
        const sortBy = filters.sortBy || "createdAt";
        const sortOrder = (filters.sortOrder || "desc").toUpperCase();

        const { rows, count } = await Store.findAndCountAll({
            where,
            attributes: {
                include: [[fn("COALESCE", fn("AVG", col("Ratings.rating_value")), 0), "overallRating"]],
            },
            include: [
                {
                    model: Rating,
                    attributes: [],
                    required: false,
                },
            ],
            group: ["Store.id"],
            order: [[sortBy, sortOrder]],
            subQuery: false,
            limit: pageLimit,
            offset,
        });

        const storeIds = rows.map((store) => store.id);
        const ratings = storeIds.length
            ? await Rating.findAll({
                where: {
                    user_id: userId,
                    store_id: { [Op.in]: storeIds },
                },
                attributes: ["store_id", "rating_value"],
            })
            : [];

        const ratingByStoreId = new Map(ratings.map((rating) => [rating.store_id, rating.rating_value]));

        const list = rows.map((store) => ({
            id: store.id,
            name: store.name,
            address: store.address,
            overallRating: Number(store.getDataValue("overallRating")),
            userSubmittedRating: ratingByStoreId.get(store.id) ?? null,
        }));

        const total = Array.isArray(count) ? count.length : count;

        return {
            list,
            total,
            page,
            pageLimit,
            totalPages: Math.ceil(total / pageLimit),
        };
    }

    async getStoreRatingsSummary({ ownerId, filters = {} }) {
        const store = await Store.findOne({ where: { owner_id: ownerId } });

        if (!store) {
            throw new Error(messages.ownerStoreNotFound);
        }

        const pageLimit = Number(filters.pageLimit || 10);
        const page = Number(filters.page || 1);
        const offset = (page - 1) * pageLimit;
        const sortBy = filters.sortBy || "createdAt";
        const sortOrder = (filters.sortOrder || "desc").toUpperCase();
        const order =
            sortBy === "name" || sortBy === "email"
                ? [[{ model: User, as: "user" }, sortBy, sortOrder]]
                : [["createdAt", sortOrder]];

        const averageRatingRow = await Rating.findOne({
            where: { store_id: store.id },
            attributes: [[fn("COALESCE", fn("AVG", col("rating_value")), 0), "averageRating"]],
            raw: true,
        });

        const { rows, count } = await Rating.findAndCountAll({
            where: { store_id: store.id },
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "name", "email", "address", "role"],
                },
            ],
            attributes: ["id", "rating_value", "createdAt"],
            order,
            limit: pageLimit,
            offset,
        });

        const list = rows.map((rating) => ({
            userId: rating.user?.id,
            name: rating.user?.name,
            email: rating.user?.email,
            address: rating.user?.address,
            role: rating.user?.role,
            submittedRating: rating.rating_value,
            submittedAt: rating.createdAt,
        }));

        return {
            storeName: store.name,
            averageRating: Number(averageRatingRow?.averageRating || 0),
            list,
            total: count,
            page,
            pageLimit,
            totalPages: Math.ceil(count / pageLimit),
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
