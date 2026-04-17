import { createContext, useContext, useEffect, useMemo, useState } from "react";
import authService from "../service/authService";
import { clearStoredSession, getStoredSession, normalizeStoredSession, setStoredSession } from "../utils/authStorage";

const ROLE_HOME_PATHS = {
    "System Administrator": "/dashboard/admin",
    "Normal User": "/dashboard/user",
    "Store Owner": "/dashboard/store-ratings-summary",
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [session, setSession] = useState(() => getStoredSession());

    useEffect(() => {
        const syncProfile = async () => {
            if (!session?.token) {
                return;
            }

            try {
                const response = await authService.getProfile();
                const normalizedSession = {
                    token: session.token,
                    user: normalizeStoredSession({ user: response?.data || response?.user || response })?.user || session.user,
                };

                setSession(normalizedSession);
                setStoredSession(normalizedSession);
            } catch {
                clearStoredSession();
                setSession(null);
            }
        };

        syncProfile();
    }, [session?.token]);

    const signIn = async ({ email, password }) => {
        const response = await authService.logIn({ email, password });
        const normalizedSession = normalizeStoredSession(response);

        setSession(normalizedSession);
        setStoredSession(normalizedSession);
        return response;
    };

    const signUp = async ({ name, email, address, password }) => authService.signUp({ name, email, address, password });

    const signOut = async () => {
        try {
            await authService.logOut();
        } finally {
            setSession(null);
            clearStoredSession();
        }
    };

    const updateProfile = async ({ name, address, password }) => {
        const response = await authService.updateProfile({ name, address, password });
        const updatedUser = response?.data || response?.user || response;

        setSession((currentSession) => {
            const mergedSession = {
                ...currentSession,
                user: {
                    ...currentSession?.user,
                    id: updatedUser?.id ?? currentSession?.user?.id,
                    name: updatedUser?.name ?? currentSession?.user?.name,
                    email: updatedUser?.email ?? currentSession?.user?.email,
                    address: updatedUser?.address ?? currentSession?.user?.address,
                    role: updatedUser?.role ?? currentSession?.user?.role,
                },
            };

            setStoredSession(mergedSession);
            return mergedSession;
        });

        return response;
    };

    const value = useMemo(
        () => ({
            session,
            isAuthenticated: Boolean(session),
            role: session?.user?.role || null,
            name: session?.user?.name || "",
            email: session?.user?.email || "",
            address: session?.user?.address || "",
            landingPath: ROLE_HOME_PATHS[session?.user?.role] || "/login",
            signIn,
            signUp,
            signOut,
            updateProfile,
        }),
        [session]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }

    return context;
};