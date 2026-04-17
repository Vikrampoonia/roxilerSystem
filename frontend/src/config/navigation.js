export const ROLES = {
    SYSTEM_ADMINISTRATOR: "System Administrator",
    NORMAL_USER: "Normal User",
    STORE_OWNER: "Store Owner",
};

export const sidebarItemsByRole = {
    [ROLES.SYSTEM_ADMINISTRATOR]: [
        { id: "admin-dashboard", name: "Dashboard", path: "/dashboard/admin" },
        { id: "admin-users", name: "Users", path: "/dashboard/admin/users" },
        { id: "admin-stores", name: "Stores", path: "/dashboard/admin/stores" },
        { id: "profile", name: "Profile", path: "/profile" },
    ],
    [ROLES.NORMAL_USER]: [
        { id: "user-dashboard", name: "Dashboard", path: "/dashboard/user" },
        { id: "profile", name: "Profile", path: "/profile" },
    ],
    [ROLES.STORE_OWNER]: [
        { id: "store-ratings-summary", name: "Store Ratings Summary", path: "/dashboard/store-ratings-summary" },
        { id: "profile", name: "Profile", path: "/profile" },
    ],
};