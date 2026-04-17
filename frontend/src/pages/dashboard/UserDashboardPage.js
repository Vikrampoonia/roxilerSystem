import { Fragment, useCallback, useState, useEffect } from "react";
import dashboardService from "../../service/dashboardService";
import LoadingSpinner from "../../components/common/LoadingSpinner";

function UserDashboardPage() {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, pageLimit: 10, total: 0, totalPages: 1 });
    const [sort, setSort] = useState({ sortBy: "", sortOrder: "" });
    const [editingStoreId, setEditingStoreId] = useState(null);
    const [ratingValue, setRatingValue] = useState(5);
    const [savingStoreId, setSavingStoreId] = useState(null);
    const [ratingError, setRatingError] = useState("");

    const fetchStores = useCallback(async (page, pageLimit = pagination.pageLimit, sortBy = sort.sortBy, sortOrder = sort.sortOrder) => {
        setLoading(true);
        setError(null);
        try {
            const response = await dashboardService.getStoresForUser({
                page,
                pageLimit,
                sortBy,
                sortOrder,
            });
            const data = response?.data || {};
            setStores(data.list || []);
            setPagination({
                page: data.page || page,
                pageLimit: data.pageLimit || pageLimit,
                total: data.total || 0,
                totalPages: data.totalPages || 1,
            });
        } catch (err) {
            setError(err.message || "Failed to fetch stores");
        } finally {
            setLoading(false);
        }
    }, [pagination.pageLimit, sort.sortBy, sort.sortOrder]);

    useEffect(() => {
        fetchStores(1, pagination.pageLimit, sort.sortBy, sort.sortOrder);
    }, [fetchStores, pagination.pageLimit, sort.sortBy, sort.sortOrder]);

    const applySort = async (sortBy, sortOrder) => {
        setSort({ sortBy, sortOrder });
        await fetchStores(1, pagination.pageLimit, sortBy, sortOrder);
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

    const openRatingEditor = (store) => {
        setRatingError("");
        setEditingStoreId(store.id);
        setRatingValue(Number(store.userSubmittedRating || 5));
    };

    const closeRatingEditor = () => {
        setEditingStoreId(null);
        setRatingValue(5);
        setRatingError("");
    };

    const handleSaveRating = async (store) => {
        setSavingStoreId(store.id);
        setRatingError("");

        const numericRating = Number.parseInt(String(ratingValue), 10);

        if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
            setRatingError("Please choose a rating between 1 and 5.");
            setSavingStoreId(null);
            return;
        }

        try {
            const payload = {
                store_id: store.id,
                rating_value: numericRating,
            };

            if (store.userSubmittedRating) {
                await dashboardService.updateStoreRating(payload);
            } else {
                await dashboardService.addStoreRating(payload);
            }

            closeRatingEditor();
            await fetchStores(pagination.page, pagination.pageLimit, sort.sortBy, sort.sortOrder);
        } catch (err) {
            setRatingError(err.message || "Failed to save rating");
        } finally {
            setSavingStoreId(null);
        }
    };

    const totalPages = pagination.totalPages || Math.ceil(pagination.total / pagination.pageLimit) || 1;
    const startIndex = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.pageLimit + 1;
    const endIndex = Math.min(pagination.page * pagination.pageLimit, pagination.total);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="section-title">User Dashboard</h1>
                <p className="section-subtitle">
                    Browse stores, view ratings, and manage your feedback.
                </p>
            </div>

            {error && (
                <div className="glass-panel border border-red-400/30 bg-red-400/10 p-4">
                    <p className="text-sm text-red-300">{error}</p>
                    <button
                        onClick={() => fetchStores(pagination.page)}
                        className="button-primary mt-3 text-xs"
                    >
                        Retry
                    </button>
                </div>
            )}

            {loading && <LoadingSpinner />}

            {!loading && stores.length === 0 && !error && (
                <div className="glass-panel p-6 text-center">
                    <p className="text-sm text-slate-400">No stores found</p>
                </div>
            )}

            {!loading && stores.length > 0 && (
                <>
                    <div className="glass-panel overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-700/50">
                                        <th className="px-4 py-3 text-left text-cyan-300/80">
                                            <div className="inline-flex items-center gap-2">
                                                <span>Store Name</span>
                                                {renderSortButton("name")}
                                            </div>
                                        </th>
                                        <th className="px-4 py-3 text-left text-cyan-300/80">Address</th>
                                        <th className="px-4 py-3 text-center text-cyan-300/80">Overall Rating</th>
                                        <th className="px-4 py-3 text-center text-cyan-300/80">Your Rating</th>
                                        <th className="px-4 py-3 text-center text-cyan-300/80">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stores.map((store) => (
                                        <Fragment key={store.id}>
                                            <tr key={store.id} className="border-b border-slate-700/30 hover:bg-slate-700/20">
                                                <td className="px-4 py-3">{store.name}</td>
                                                <td className="px-4 py-3 text-slate-400">{store.address}</td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="inline-block rounded bg-cyan-300/20 px-2.5 py-1 text-cyan-300">
                                                        {store.overallRating ? store.overallRating.toFixed(1) : "N/A"}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    {store.userSubmittedRating ? (
                                                        <span className="inline-block rounded bg-amber-400/20 px-2.5 py-1 text-amber-300">
                                                            {store.userSubmittedRating}
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-500">Not rated</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button
                                                        type="button"
                                                        className="button-primary text-xs"
                                                        onClick={() => openRatingEditor(store)}
                                                    >
                                                        {store.userSubmittedRating ? "Edit Rating" : "Add Rating"}
                                                    </button>
                                                </td>
                                            </tr>

                                            {editingStoreId === store.id ? (
                                                <tr key={`${store.id}-editor`} className="border-b border-slate-700/30 bg-slate-900/40">
                                                    <td colSpan={5} className="px-4 py-4">
                                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                                                            <div className="w-full sm:max-w-xs">
                                                                <label className="block space-y-2">
                                                                    <span className="text-sm text-slate-300">Choose Rating</span>
                                                                    <select
                                                                        className="input-field"
                                                                        value={ratingValue}
                                                                        onChange={(event) => setRatingValue(Number(event.target.value))}
                                                                    >
                                                                        {[1, 2, 3, 4, 5].map((value) => (
                                                                            <option key={value} value={value}>
                                                                                {value}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                </label>
                                                            </div>

                                                            <div className="flex flex-wrap gap-2">
                                                                <button
                                                                    type="button"
                                                                    className="button-primary"
                                                                    disabled={savingStoreId === store.id}
                                                                    onClick={() => handleSaveRating(store)}
                                                                >
                                                                    {savingStoreId === store.id ? "Saving..." : store.userSubmittedRating ? "Update Rating" : "Submit Rating"}
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="button-secondary"
                                                                    onClick={closeRatingEditor}
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {ratingError ? (
                                                            <p className="mt-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                                                                {ratingError}
                                                            </p>
                                                        ) : null}
                                                    </td>
                                                </tr>
                                            ) : null}
                                        </Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between">
                        <p className="text-xs text-slate-400">
                            Showing {startIndex}-{endIndex} of {pagination.total}
                        </p>
                        <div className="flex items-center gap-2 whitespace-nowrap">
                            <button
                                onClick={() => fetchStores(pagination.page - 1, pagination.pageLimit, sort.sortBy, sort.sortOrder)}
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
                                    fetchStores(1, nextPageLimit, sort.sortBy, sort.sortOrder);
                                }}
                            >
                                {[10, 20, 50].map((size) => (
                                    <option key={size} value={size}>{size}</option>
                                ))}
                            </select>

                            <button
                                onClick={() => fetchStores(pagination.page + 1, pagination.pageLimit, sort.sortBy, sort.sortOrder)}
                                disabled={pagination.page === totalPages}
                                className="button-primary disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default UserDashboardPage;