import { request } from "./apiClient";

export const dashboardService = {
    // User Dashboard: Get stores with pagination and filters
    getStoresForUser: (filters = {}) => request("/user/get-store", {
        method: "POST",
        body: JSON.stringify({ filters }),
    }),

    addStoreRating: ({ store_id, rating_value }) => request("/user/add-rating", {
        method: "POST",
        body: JSON.stringify({ store_id, rating_value }),
    }),

    updateStoreRating: ({ store_id, rating_value }) => request("/user/update-rating", {
        method: "PUT",
        body: JSON.stringify({ store_id, rating_value }),
    }),

    // Store Owner Dashboard: Get ratings summary with pagination
    getStoreRatingsSummary: (filters = {}) => {
        const query = new URLSearchParams(filters).toString();
        const path = query ? `/user/store-ratings-summary?${query}` : "/user/store-ratings-summary";

        return request(path, {
            method: "GET",
        });
    },
};

export default dashboardService;
