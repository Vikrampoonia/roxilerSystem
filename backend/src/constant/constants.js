class Constants {
    constructor () {
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
    }
};
 
export default new Constants();