import { useEffect, useState } from "react";
import dashboardService from "../../service/dashboardService";
import LoadingSpinner from "../../components/common/LoadingSpinner";

function StoreOwnerDashboardPage() {
    const [averageRating, setAverageRating] = useState(0);
    const [ratingsList, setRatingsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, pageLimit: 10, total: 0, totalPages: 1 });
    const [sort, setSort] = useState({ sortBy: "", sortOrder: "" });

    const fetchRatingsSummary = async (page, pageLimit = pagination.pageLimit, sortBy = sort.sortBy, sortOrder = sort.sortOrder) => {
        setLoading(true);
        setError(null);

        try {
            const response = await dashboardService.getStoreRatingsSummary({
                page,
                pageLimit,
                sortBy,
                sortOrder,
            });
            const data = response?.data || {};

            setAverageRating(Number(data.averageRating || 0));
            setRatingsList(data.list || []);
            setPagination({
                page: data.page || page,
                pageLimit: data.pageLimit || pageLimit,
                total: data.total || 0,
                totalPages: data.totalPages || 1,
            });
        } catch (err) {
            setError(err.message || "Failed to fetch ratings summary");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRatingsSummary(1, pagination.pageLimit, sort.sortBy, sort.sortOrder);
    }, []);

    const applySort = async (sortBy, sortOrder) => {
        setSort({ sortBy, sortOrder });
        await fetchRatingsSummary(1, pagination.pageLimit, sortBy, sortOrder);
    };

    const toggleSort = (field) => {
        const nextOrder = sort.sortBy === field && sort.sortOrder === "asc" ? "desc" : "asc";
        applySort(field, nextOrder);
    };

    const renderSortButton = (field) => {
        const isActive = sort.sortBy === field;
        const icon = !isActive ? "↕" : sort.sortOrder === "asc" ? "↑" : "↓";

        return (
            <button
                type="button"
                aria-label={`Sort by ${field} ${isActive && sort.sortOrder === "asc" ? "descending" : "ascending"}`}
                title={isActive ? `Sorted ${sort.sortOrder}` : "Sort"}
                className={`inline-flex h-6 w-6 items-center justify-center rounded-full border text-[10px] transition ${isActive
                        ? "border-cyan-300/50 bg-cyan-300/15 text-cyan-200"
                        : "border-slate-600/60 bg-slate-800/40 text-slate-400 hover:border-cyan-300/40 hover:text-cyan-200"
                    }`}
                onClick={() => toggleSort(field)}
            >
                {icon}
            </button>
        );
    };

    const totalPages = pagination.totalPages || Math.ceil(pagination.total / pagination.pageLimit) || 1;
    const startIndex = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.pageLimit + 1;
    const endIndex = Math.min(pagination.page * pagination.pageLimit, pagination.total);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="section-title">Store Ratings Summary</h1>
                <p className="section-subtitle">
                    View your store's average rating and see who has rated you.
                </p>
            </div>

            {error && (
                <div className="glass-panel border border-red-400/30 bg-red-400/10 p-4">
                    <p className="text-sm text-red-300">{error}</p>
                    <button
                        onClick={() => fetchRatingsSummary(pagination.page, pagination.pageLimit, sort.sortBy, sort.sortOrder)}
                        className="button-primary mt-3 text-xs"
                    >
                        Retry
                    </button>
                </div>
            )}

            {loading && <LoadingSpinner />}

            {!loading && (
                <>
                    <div className="glass-panel p-6">
                        <p className="text-sm uppercase tracking-[0.28em] text-cyan-300/80">Average Rating</p>
                        <p className="mt-4 text-5xl font-black text-white">{averageRating.toFixed(1)}</p>
                        <p className="mt-2 text-xs text-slate-400">
                            Based on {pagination.total} {pagination.total === 1 ? "rating" : "ratings"}
                        </p>
                    </div>

                    {ratingsList.length === 0 && !error ? (
                        <div className="glass-panel p-6 text-center">
                            <p className="text-sm text-slate-400">No ratings yet</p>
                        </div>
                    ) : (
                        <>
                            <div className="glass-panel overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-slate-700/50">
                                                <th className="px-4 py-3 text-left text-cyan-300/80">
                                                    <div className="inline-flex items-center gap-2">
                                                        <span>User Name</span>
                                                        {renderSortButton("name")}
                                                    </div>
                                                </th>
                                                <th className="px-4 py-3 text-left text-cyan-300/80">
                                                    <div className="inline-flex items-center gap-2">
                                                        <span>Email</span>
                                                        {renderSortButton("email")}
                                                    </div>
                                                </th>
                                                <th className="px-4 py-3 text-left text-cyan-300/80">Address</th>
                                                <th className="px-4 py-3 text-center text-cyan-300/80">Rating</th>
                                                <th className="px-4 py-3 text-left text-cyan-300/80">Submitted At</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {ratingsList.map((rating) => (
                                                <tr key={rating.id} className="border-b border-slate-700/30 hover:bg-slate-700/20">
                                                    <td className="px-4 py-3">{rating.name}</td>
                                                    <td className="px-4 py-3 text-slate-400">{rating.email}</td>
                                                    <td className="px-4 py-3 text-slate-400">{rating.address}</td>
                                                    <td className="px-4 py-3 text-center">
                                                        <span className="inline-block rounded bg-amber-400/20 px-2.5 py-1 text-amber-300 font-semibold">
                                                            {rating.submittedRating}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-xs text-slate-500">
                                                        {new Date(rating.submittedAt).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <p className="text-xs text-slate-400">
                                    Showing {startIndex}-{endIndex} of {pagination.total}
                                </p>
                                <div className="flex items-center gap-2 whitespace-nowrap">
                                    <button
                                        onClick={() => fetchRatingsSummary(pagination.page - 1, pagination.pageLimit, sort.sortBy, sort.sortOrder)}
                                        disabled={pagination.page === 1}
                                        className="button-primary disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                                    >
                                        Previous
                                    </button>
                                    <span className="flex items-center px-3 text-xs text-slate-400">
                                        Page {pagination.page} of {totalPages}
                                    </span>

                                    <select
                                        className="input-field w-20"
                                        value={pagination.pageLimit}
                                        onChange={(event) => {
                                            const nextPageLimit = Number(event.target.value);
                                            setPagination((current) => ({ ...current, pageLimit: nextPageLimit, page: 1 }));
                                            fetchRatingsSummary(1, nextPageLimit, sort.sortBy, sort.sortOrder);
                                        }}
                                    >
                                        {[10, 20, 50].map((size) => (
                                            <option key={size} value={size}>{size}</option>
                                        ))}
                                    </select>

                                    <button
                                        onClick={() => fetchRatingsSummary(pagination.page + 1, pagination.pageLimit, sort.sortBy, sort.sortOrder)}
                                        disabled={pagination.page === totalPages}
                                        className="button-primary disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
}

export default StoreOwnerDashboardPage;
