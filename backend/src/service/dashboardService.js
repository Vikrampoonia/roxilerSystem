import User from "../modals/userModals.js";
import Store from "../modals/storeModals.js";
import Rating from "../modals/ratingModals.js";

class DashboardService {
    async getDashboardSummary() {
        const [totalUsers, totalStores, totalRatings] = await Promise.all([
            User.count(),
            Store.count(),
            Rating.count(),
        ]);

        return {
            totalUsers,
            totalStores,
            totalRatings,
        };
    }
}

export default new DashboardService();
