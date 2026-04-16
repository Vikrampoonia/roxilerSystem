
export const sanitizeUser = (user) => {
    if (!user) return null;

    const sanitizedUser = user.toJSON ? user.toJSON() : { ...user };
    delete sanitizedUser.password;

    return sanitizedUser;
};
