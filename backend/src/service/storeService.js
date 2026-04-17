import { Op, fn, col } from "sequelize";
import Store from "../modals/storeModals.js";
import User from "../modals/userModals.js";
import Rating from "../modals/ratingModals.js";
import messages from "../constant/message.js";

class StoreService {
    async createStore({ name, email, address, owner_email }) {
        const existingStore = await Store.findOne({ where: { email } });
        if (existingStore) {
            throw new Error(messages.storeEmailAlreadyExists);
        }

        let ownerId = null;

        if (owner_email) {
            const owner = await User.findOne({ where: { email: owner_email } });
            if (!owner) {
                throw new Error(messages.ownerNotFound);
            }
            if (owner.role !== "Store Owner") {
                throw new Error(messages.ownerRoleInvalid);
            }

            ownerId = owner.id;
        }

        return await Store.create({
            name,
            email,
            address,
            owner_id: ownerId,
        });
    }

    async getStore({ filters = {} }) {
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

        return {
            list: rows,
            total: Array.isArray(count) ? count.length : count,
            page,
            pageLimit,
            totalPages: Math.ceil((Array.isArray(count) ? count.length : count) / pageLimit),
        };
    }
}

export default new StoreService();
