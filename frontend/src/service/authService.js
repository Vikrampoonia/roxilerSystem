import { request } from "./apiClient";

export const authService = {
    logIn: (payload) => request("/auth/logIn", {
        method: "POST",
        body: JSON.stringify(payload),
    }),
    signUp: (payload) => request("/auth/signUp", {
        method: "POST",
        body: JSON.stringify(payload),
    }),
    logOut: () => request("/auth/logOut", {
        method: "POST",
    }),
    getProfile: () => request("/user/profile", {
        method: "GET",
    }),
    updateProfile: (payload) => request("/user/update-profile", {
        method: "PUT",
        body: JSON.stringify(payload),
    }),
};

export default authService;