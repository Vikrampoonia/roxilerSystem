const LIMITS = {
    NAME_MIN: 20,
    NAME_MAX: 60,
    ADDRESS_MAX: 400,
    PASS_MIN: 8,
    PASS_MAX: 16,
};

const REGEX = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PASSWORD_UPPERCASE: /[A-Z]/,
    PASSWORD_SPECIAL: /[!@#$%^&*]/,
};

export const validateEmail = (email) => {
    if (!email?.trim()) {
        return "Email is required.";
    }

    if (!REGEX.EMAIL.test(email.trim())) {
        return "Please enter a valid email address.";
    }

    return "";
};

export const validateName = (name) => {
    const value = name?.trim() || "";
    if (!value) {
        return "Name is required.";
    }

    if (value.length < LIMITS.NAME_MIN || value.length > LIMITS.NAME_MAX) {
        return `Name must be between ${LIMITS.NAME_MIN} and ${LIMITS.NAME_MAX} characters.`;
    }

    return "";
};

export const validateAddress = (address) => {
    const value = address?.trim() || "";
    if (!value) {
        return "Address is required.";
    }

    if (value.length > LIMITS.ADDRESS_MAX) {
        return `Address cannot exceed ${LIMITS.ADDRESS_MAX} characters.`;
    }

    return "";
};

export const validatePassword = (password) => {
    const value = password || "";
    if (!value) {
        return "Password is required.";
    }

    if (value.length < LIMITS.PASS_MIN || value.length > LIMITS.PASS_MAX) {
        return `Password must be between ${LIMITS.PASS_MIN} and ${LIMITS.PASS_MAX} characters.`;
    }

    if (!REGEX.PASSWORD_UPPERCASE.test(value)) {
        return "Password must include at least one uppercase letter.";
    }

    if (!REGEX.PASSWORD_SPECIAL.test(value)) {
        return "Password must include at least one special character (!@#$%^&*).";
    }

    return "";
};
