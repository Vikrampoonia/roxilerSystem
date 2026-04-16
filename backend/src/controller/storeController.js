import Result from "../constant/result.js";
import constants from "../constant/constants.js";
import messages from "../constant/message.js";
import storeService from "../service/storeService.js";
import { createStoreSchema, getStoreFilterSchema } from "../utils/validation.js";

class StoreController {
    async createStore({ name, email, address, owner_email }) {
        const res = new Result();
        const { httpStatus } = constants;

        try {
            const validationResult = createStoreSchema.safeParse({
                name,
                email,
                address,
                owner_email,
            });

            if (!validationResult.success) {
                res.status = httpStatus.badRequest;
                res.message = validationResult.error.issues[0]?.message || messages.invalidSignupCredentials;
                return res;
            }

            const data = await storeService.createStore(validationResult.data);
            res.status = httpStatus.created;
            res.message = messages.storeCreatedSuccessfully;
            res.data = data;
            return res;
        } catch (err) {
            const conflictMessages = [
                messages.storeEmailAlreadyExists,
                messages.ownerNotFound,
                messages.ownerRoleInvalid,
            ];

            res.status = conflictMessages.includes(err.message) ? httpStatus.badRequest : httpStatus.serverError;
            res.message = err.message || messages.unableToSignup;
            return res;
        }
    }

    async getStore({ filters }) {
        const res = new Result();
        const { httpStatus } = constants;

        try {
            const validationResult = getStoreFilterSchema.safeParse(filters);

            if (!validationResult.success) {
                res.status = httpStatus.badRequest;
                res.message = validationResult.error.issues[0]?.message || messages.invalidSignupCredentials;
                return res;
            }

            const data = await storeService.getStore({ filters: validationResult.data || {} });
            res.status = httpStatus.success;
            res.message = messages.storesFetchedSuccessfully;
            res.data = data;
            return res;
        } catch (err) {
            res.status = httpStatus.serverError;
            res.message = err.message || messages.unableToSignup;
            return res;
        }
    }
}

export default new StoreController();
