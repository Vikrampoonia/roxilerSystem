import { request } from "./apiClient";

const toQueryString = (filters = {}) => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            params.set(key, String(value));
        }
    });

    return params.toString();
};

const adminService = {
    getDashboardStats: () => request("/admin/stats", { method: "GET" }),
    getUsers: (filters = {}) => {
        const query = toQueryString(filters);
        const path = query ? `/user/get-user?${query}` : "/user/get-user";
        return request(path, { method: "GET" });
    },
    getUserById: (id) => request(`/user/get-user/${id}`, { method: "GET" }),
    createUser: (payload) => request("/user/create-user", {
        method: "POST",
        body: JSON.stringify(payload),
    }),
    getStores: (filters = {}) => request("/store/get-store", {
        method: "POST",
        body: JSON.stringify({ filters }),
    }),
    createStore: (payload) => request("/store/create-store", {
        method: "POST",
        body: JSON.stringify(payload),
    }),
};

export default adminService;
