import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import adminService from "../../service/adminService";

function AdminDashboardPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAdminStats();
    }, []);

    const fetchAdminStats = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await adminService.getDashboardStats();
            setStats(response?.data || null);
        } catch (err) {
            setError(err.message || "Failed to fetch admin statistics");
            setStats(null);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        { title: "Users", description: "Total registered users", value: "—" },
        { title: "Stores", description: "Total stores onboarded", value: "—" },
        { title: "Ratings", description: "Total ratings submitted", value: "—" },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="section-title">Admin Dashboard</h1>
                <p className="section-subtitle">
                    Platform-wide metrics and user/store management.
                </p>
            </div>

            {error && (
                <div className="glass-panel border border-amber-400/30 bg-amber-400/10 p-4">
                    <p className="text-sm text-amber-300">{error}</p>
                    <p className="mt-2 text-xs text-slate-400">
                        To implement: Create a GET /api/admin/stats backend endpoint that returns {`{usersCount, storesCount, ratingsCount}`}
                    </p>
                    <button
                        onClick={fetchAdminStats}
                        className="button-primary mt-3 text-xs"
                    >
                        Retry
                    </button>
                </div>
            )}

            {loading && <LoadingSpinner />}

            {!loading && (
                <div className="grid gap-4 md:grid-cols-3">
                    {stats ? (
                        <>
                            <div className="glass-panel p-5">
                                <p className="text-sm uppercase tracking-[0.28em] text-cyan-300/80">Users</p>
                                <p className="mt-4 text-3xl font-bold text-white">{stats.usersCount || 0}</p>
                                <p className="mt-2 text-xs text-slate-400">Total registered users</p>
                            </div>
                            <div className="glass-panel p-5">
                                <p className="text-sm uppercase tracking-[0.28em] text-cyan-300/80">Stores</p>
                                <p className="mt-4 text-3xl font-bold text-white">{stats.storesCount || 0}</p>
                                <p className="mt-2 text-xs text-slate-400">Total stores onboarded</p>
                            </div>
                            <div className="glass-panel p-5">
                                <p className="text-sm uppercase tracking-[0.28em] text-cyan-300/80">Ratings</p>
                                <p className="mt-4 text-3xl font-bold text-white">{stats.ratingsCount || 0}</p>
                                <p className="mt-2 text-xs text-slate-400">Total ratings submitted</p>
                            </div>
                        </>
                    ) : (
                        statCards.map(({ title, description, value }) => (
                            <div key={title} className="glass-panel p-5 opacity-60">
                                <p className="text-sm uppercase tracking-[0.28em] text-cyan-300/80">{title}</p>
                                <p className="mt-4 text-3xl font-bold text-slate-400">{value}</p>
                                <p className="mt-2 text-xs text-slate-500">{description}</p>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Management Sections */}
            {!loading && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-8">
                    <div className="glass-panel p-5">
                        <p className="text-sm uppercase tracking-[0.28em] text-cyan-300/80">User Management</p>
                        <p className="mt-3 text-xs text-slate-400">View, search, and manage registered users</p>
                        <Link to="/dashboard/admin/users" className="button-primary mt-4 text-xs">
                            View Users
                        </Link>
                    </div>
                    <div className="glass-panel p-5">
                        <p className="text-sm uppercase tracking-[0.28em] text-cyan-300/80">Store Management</p>
                        <p className="mt-3 text-xs text-slate-400">Approve stores, manage visibility</p>
                        <Link to="/dashboard/admin/stores" className="button-primary mt-4 text-xs">
                            View Stores
                        </Link>
                    </div>
                    <div className="glass-panel p-5">
                        <p className="text-sm uppercase tracking-[0.28em] text-cyan-300/80">Ratings Overview</p>
                        <p className="mt-3 text-xs text-slate-400">Monitor and moderate ratings</p>
                        <button className="button-primary mt-4 text-xs opacity-50 cursor-not-allowed">
                            View Ratings (Backend Required)
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDashboardPage;