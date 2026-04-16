import Result from "../constant/result.js";
import userService from "../service/userService.js";
import constants from "../constant/constants.js";
import messages from "../constant/message.js";
import {
    addRatingSchema,
    createUserSchema,
    getStoreForUserFilterSchema,
    getUserByIdSchema,
    getUserFilterSchema,
    storeRatingsSummaryFilterSchema,
    updateProfileSchema,
    updateRatingSchema,
} from "../utils/validation.js";


class UserController {
    async createUser({ name, email, password, address, role }) {
        const res = new Result();
        const { httpStatus } = constants;
        try {
            const validationResult = createUserSchema.safeParse({ name, email, password, address, role });

            if (!validationResult.success) {
                res.status = httpStatus.badRequest;
                res.message = validationResult.error.issues[0]?.message || messages.invalidSignupCredentials;
                return res;
            }

            const data = await userService.createUser(validationResult.data);
            res.status = httpStatus.created;
            res.message = messages.userCreatedSuccessfully;
            res.data = data;
            return res;
        } catch (err) {
            res.status = err.message === messages.emailAlreadyExists ? httpStatus.conflict : httpStatus.serverError;
            res.message = err.message || messages.unableToSignup;
            return res;
        }
    }

    async getUser({ filters }) {
        const res = new Result();
        const { httpStatus } = constants;
        try {
            const validationResult = getUserFilterSchema.safeParse(filters);

            if (!validationResult.success) {
                res.status = httpStatus.badRequest;
                res.message = validationResult.error.issues[0]?.message || messages.invalidSignupCredentials;
                return res;
            }

            const data = await userService.getUser({ filters: validationResult.data || {} });
            res.status = httpStatus.success;
            res.message = messages.usersFetchedSuccessfully;
            res.data = data;
            return res;
        } catch (err) {
            res.status = httpStatus.serverError;
            res.message = err.message || messages.unableToSignup;
            return res;
        }
    }

    async getUserById({ userId }) {
        const res = new Result();
        const { httpStatus } = constants;

        try {
            const validationResult = getUserByIdSchema.safeParse({ id: userId });

            if (!validationResult.success) {
                res.status = httpStatus.badRequest;
                res.message = validationResult.error.issues[0]?.message || messages.invalidSignupCredentials;
                return res;
            }

            const data = await userService.getUserById({ userId: validationResult.data.id });
            res.status = httpStatus.success;
            res.message = messages.userDetailFetchedSuccessfully;
            res.data = data;
            return res;
        } catch (err) {
            res.status = err.message === messages.userNotFound ? httpStatus.notFound : httpStatus.serverError;
            res.message = err.message || messages.unableToSignup;
            return res;
        }
    }

    async addRating({ userId, store_id, rating_value }) {
        const res = new Result();
        const { httpStatus } = constants;

        try {
            const validationResult = addRatingSchema.safeParse({ store_id, rating_value });

            if (!validationResult.success) {
                res.status = httpStatus.badRequest;
                res.message = validationResult.error.issues[0]?.message || messages.invalidSignupCredentials;
                return res;
            }

            const data = await userService.addRating({
                userId,
                storeId: validationResult.data.store_id,
                ratingValue: validationResult.data.rating_value,
            });

            res.status = httpStatus.created;
            res.message = messages.ratingAddedSuccessfully;
            res.data = data;
            return res;
        } catch (err) {
            const badRequestMessages = [messages.storeNotFound, messages.ratingAlreadySubmitted];
            res.status = badRequestMessages.includes(err.message) ? httpStatus.badRequest : httpStatus.serverError;
            res.message = err.message || messages.unableToSignup;
            return res;
        }
    }

    async updateRating({ userId, store_id, rating_value }) {
        const res = new Result();
        const { httpStatus } = constants;

        try {
            const validationResult = updateRatingSchema.safeParse({ store_id, rating_value });

            if (!validationResult.success) {
                res.status = httpStatus.badRequest;
                res.message = validationResult.error.issues[0]?.message || messages.invalidSignupCredentials;
                return res;
            }

            const data = await userService.updateRating({
                userId,
                storeId: validationResult.data.store_id,
                ratingValue: validationResult.data.rating_value,
            });

            res.status = httpStatus.success;
            res.message = messages.ratingUpdatedSuccessfully;
            res.data = data;
            return res;
        } catch (err) {
            res.status = err.message === messages.ratingNotFound ? httpStatus.notFound : httpStatus.serverError;
            res.message = err.message || messages.unableToSignup;
            return res;
        }
    }

    async getStoreForUser({ userId, filters }) {
        const res = new Result();
        const { httpStatus } = constants;

        try {
            const validationResult = getStoreForUserFilterSchema.safeParse(filters);

            if (!validationResult.success) {
                res.status = httpStatus.badRequest;
                res.message = validationResult.error.issues[0]?.message || messages.invalidSignupCredentials;
                return res;
            }

            const data = await userService.getStoreForUser({
                userId,
                filters: validationResult.data || {},
            });

            res.status = httpStatus.success;
            res.message = messages.userStoresFetchedSuccessfully;
            res.data = data;
            return res;
        } catch (err) {
            res.status = httpStatus.serverError;
            res.message = err.message || messages.unableToSignup;
            return res;
        }
    }

    async getStoreRatingsSummary({ ownerId, filters }) {
        const res = new Result();
        const { httpStatus } = constants;

        try {
            const validationResult = storeRatingsSummaryFilterSchema.safeParse(filters);

            if (!validationResult.success) {
                res.status = httpStatus.badRequest;
                res.message = validationResult.error.issues[0]?.message || messages.invalidSignupCredentials;
                return res;
            }

            const data = await userService.getStoreRatingsSummary({
                ownerId,
                filters: validationResult.data || {},
            });

            res.status = httpStatus.success;
            res.message = messages.storeRatingsSummaryFetchedSuccessfully;
            res.data = data;
            return res;
        } catch (err) {
            res.status = err.message === messages.ownerStoreNotFound ? httpStatus.notFound : httpStatus.serverError;
            res.message = err.message || messages.unableToSignup;
            return res;
        }
    }

    async updateProfile({ userId, name, address, password }) {
        const res = new Result();
        const { httpStatus } = constants;
        try {
            const validationResult = updateProfileSchema.safeParse({ name, address, password });

            if (!validationResult.success) {
                res.status = httpStatus.badRequest;
                res.message = validationResult.error.issues[0]?.message || messages.invalidSignupCredentials;
                return res;
            }

            const data = await userService.updateProfile({
                userId,
                name,
                address,
                password,
            });
            res.status = httpStatus.success;
            res.message = messages.profileUpdatedSuccessfully;
            res.data = data;
            return res;
        } catch (err) {
            res.status = httpStatus.serverError;
            res.message = err.message || messages.unableToUpdateProfile;
            return res;
        }
    }
}

export default new UserController();

