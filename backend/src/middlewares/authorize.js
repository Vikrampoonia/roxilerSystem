const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        const user = req.user;

        if (!user) {
            return res.status(401).send({
                status: 401,
                message: "Unauthorized",
            });
        }

        if (!allowedRoles.includes(user.role)) {
            return res.status(403).send({
                status: 403,
                message: "Forbidden",
            });
        }

        next();
    };
};

export default authorize;
