const AUTH_STORAGE_KEY = "roxiler_system_session";

export const getStoredSession = () => {
    if (typeof window === "undefined") {
        return null;
    }

    const rawSession = window.localStorage.getItem(AUTH_STORAGE_KEY);

    if (!rawSession) {
        return null;
    }

    try {
        return JSON.parse(rawSession);
    } catch {
        return null;
    }
};

export const setStoredSession = (session) => {
    if (typeof window === "undefined") {
        return;
    }

    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
};

export const clearStoredSession = () => {
    if (typeof window === "undefined") {
        return;
    }

    window.localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const normalizeStoredSession = (responseData) => {
    const user = responseData?.user || responseData?.data?.user || responseData?.data || null;
    const accessToken = responseData?.accessToken || responseData?.data?.accessToken || responseData?.token || null;

    if (!user) {
        return null;
    }

    return {
        token: accessToken,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            address: user.address || "",
            role: user.role || "Normal User",
        },
    };
};