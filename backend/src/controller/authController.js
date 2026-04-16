import Result from "../constant/result.js";
import authService from "../service/authService.js";
import constants from "../constant/constants.js";
import messages from "../constant/message.js";
import { loginSchema, signupSchema } from "../utils/validation.js";


class AuthController {
    async logIn({ email, password }) {
        const res = new Result();
        const { httpStatus } = constants;
        try {
            const validationResult = loginSchema.safeParse({ email, password });

            if (!validationResult.success) {
                res.status = httpStatus.badRequest;
                res.message = validationResult.error.issues[0]?.message || messages.invalidLoginCredentials;
                return res;
            }

            const data = await authService.logIn(validationResult.data);
            res.status = httpStatus.success;
            res.message = messages.successfullLogin;
            res.data = data;
            return res;
        } catch (err) {
            res.status = err.message === messages.invalidLoginCredentials ? httpStatus.unauthorized : httpStatus.serverError;
            res.message = err.message || messages.invalidLoginCredentials;
            return res;
        }
    }

    async signUp({ name, email, address, password }) {
        const res = new Result();
        const { httpStatus } = constants;
        try {
            const validationResult = signupSchema.safeParse({
                name,
                email,
                address,
                password,
            });

            if (!validationResult.success) {
                res.status = httpStatus.badRequest;
                res.message = validationResult.error.issues[0]?.message || messages.invalidSignupCredentials;
                return res;
            }

            const data = await authService.signUp({ userData: validationResult.data });
            res.status = httpStatus.success;
            res.message = messages.signupSuccessful;
            res.data = data;
            return res;
        } catch (err) {
            res.status = httpStatus.serverError;
            res.message = err.message || messages.unableToSignup;
            return res;
        }
    }

    async logOut({ req }) {
        const res = new Result();
        const { httpStatus } = constants;
        try {
            const data = await authService.logOut({ req });
            res.status = httpStatus.success;
            res.message = messages.successfullLogout;
            res.data = data;
            return res;
        } catch (err) {
            res.status = httpStatus.serverError;
            res.message = err.message || messages.unableToLogout;
            return res;
        }
    }
}

export default new AuthController();

