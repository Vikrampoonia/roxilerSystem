import Result from "../constant/result.js";
import userService from "../service/userService.js";
import constants from "../constant/constants.js";
import messages from "../constant/message.js";
import { createUserSchema, getUserFilterSchema, updateProfileSchema } from "../utils/validation.js";


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

