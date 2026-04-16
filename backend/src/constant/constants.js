class Constants {
    constructor() {
        this.limits = {
            NAME_MIN: 20,
            NAME_MAX: 60,
            ADDRESS_MAX: 400,
            PASS_MIN: 8,
            PASS_MAX: 16,
        };

        this.regex = {
            EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            PASSWORD_UPPERCASE: /[A-Z]/,
            PASSWORD_SPECIAL: /[!@#$%^&*]/,
        };

        this.httpStatus = {
            success: 200,
            created: 201,
            accepted: 202,
            unauthorized: 401,
            forbidden: 403,
            serverError: 500,
            noContent: 204,
            notFound: 404,
            badRequest: 400,
            conflict: 409,
            notAllowed: 405,
            serviceUnavailable: 503,
            modified: 302,
        };

        this.roles = {
            systemAdministrator: "System Administrator",
            normalUser: "Normal User",
            storeOwner: "Store Owner",
        };
    }
};

export default new Constants();