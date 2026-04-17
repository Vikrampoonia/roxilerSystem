import { useEffect, useMemo, useState } from "react";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import adminService from "../../service/adminService";
import { validateAddress, validateEmail, validateName } from "../../utils/validation";

function AdminStoresPage() {
    const [stores, setStores] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [pagination, setPagination] = useState({ page: 1, pageLimit: 10, total: 0, totalPages: 1 });
    const [sort, setSort] = useState({ sortBy: "", sortOrder: "" });
    const [isCreating, setIsCreating] = useState(false);
    const [isCreatingStore, setIsCreatingStore] = useState(false);
    const [createErrorMessage, setCreateErrorMessage] = useState("");
    const [createForm, setCreateForm] = useState({
        name: "",
        email: "",
        address: "",
        owner_email: "",
    });

    const fetchStores = async (page = 1, pageLimit = pagination.pageLimit, sortBy = sort.sortBy, sortOrder = sort.sortOrder) => {
        setIsLoading(true);
        setErrorMessage("");
        try {
            const response = await adminService.getStores({ page, pageLimit, sortBy, sortOrder });
            const data = response?.data || {};
            const list = data.list || [];
            setStores(list);
            setPagination({
                page: data.page || page,
                pageLimit: data.pageLimit || pageLimit,
                total: data.total || 0,
                totalPages: data.totalPages || 1,
            });
        } catch (error) {
            setErrorMessage(error.message || "Unable to load stores");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStores(1, pagination.pageLimit, sort.sortBy, sort.sortOrder);
    }, []);

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

    const handleCreateChange = (event) => {
        const { name, value } = event.target;
        setCreateForm((current) => ({ ...current, [name]: value }));
    };

    const handleCreateStore = async (event) => {
        event.preventDefault();
        setIsCreatingStore(true);
        setCreateErrorMessage("");

        const nameError = validateName(createForm.name);
        const emailError = validateEmail(createForm.email);
        const ownerEmailError = validateEmail(createForm.owner_email);
        const addressError = validateAddress(createForm.address);
        const firstError = nameError || emailError || ownerEmailError || addressError;

        if (firstError) {
            setCreateErrorMessage(firstError);
            setIsCreatingStore(false);
            return;
        }

        try {
            await adminService.createStore(createForm);
            setCreateForm({
                name: "",
                email: "",
                address: "",
                owner_email: "",
            });
            setIsCreating(false);
            await fetchStores(1, pagination.pageLimit, sort.sortBy, sort.sortOrder);
        } catch (error) {
            setCreateErrorMessage(error.message || "Unable to create store");
        } finally {
            setIsCreatingStore(false);
        }
    };

    const filteredStores = useMemo(() => {
        const needle = searchTerm.trim().toLowerCase();
        if (!needle) {
            return stores;
        }

        return stores.filter((store) =>
            [store.name, store.email, store.address]
                .filter(Boolean)
                .some((value) => String(value).toLowerCase().includes(needle))
        );
    }, [searchTerm, stores]);

    const startIndex = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.pageLimit + 1;
    const endIndex = Math.min(pagination.page * pagination.pageLimit, pagination.total);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="section-title">Stores Management</h1>
                    <p className="section-subtitle">View all stores with their overall rating.</p>
                </div>
                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
                    <button
                        type="button"
                        className="button-primary"
                        onClick={() => {
                            setCreateErrorMessage("");
                            setIsCreating((current) => !current);
                        }}
                    >
                        {isCreating ? "Close" : "Add Store"}
                    </button>

                    <div className="w-full sm:w-64">
                        <input
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            className="input-field"
                            placeholder="Search name, email, address"
                        />
                    </div>
                </div>
            </div>

            {isCreating ? (
                <div className="glass-panel p-5">
                    <p className="text-sm font-semibold text-white">Add New Store</p>
                    <form className="mt-4 grid gap-4 sm:grid-cols-2" onSubmit={handleCreateStore}>
                        <label className="block space-y-2 sm:col-span-2">
                            <span className="text-sm text-slate-300">Store Name</span>
                            <input name="name" value={createForm.name} onChange={handleCreateChange} className="input-field" required />
                        </label>

                        <label className="block space-y-2">
                            <span className="text-sm text-slate-300">Store Email</span>
                            <input type="email" name="email" value={createForm.email} onChange={handleCreateChange} className="input-field" required />
                        </label>

                        <label className="block space-y-2">
                            <span className="text-sm text-slate-300">Owner Email</span>
                            <input type="email" name="owner_email" value={createForm.owner_email} onChange={handleCreateChange} className="input-field" required />
                        </label>

                        <label className="block space-y-2 sm:col-span-2">
                            <span className="text-sm text-slate-300">Address</span>
                            <textarea name="address" value={createForm.address} onChange={handleCreateChange} className="input-field min-h-24 resize-none" required />
                        </label>

                        {createErrorMessage ? (
                            <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200 sm:col-span-2">
                                {createErrorMessage}
                            </p>
                        ) : null}

                        <button type="submit" className="button-primary sm:col-span-2" disabled={isCreatingStore}>
                            {isCreatingStore ? "Creating store..." : "Create Store"}
                        </button>
                    </form>
                </div>
            ) : null}

            {errorMessage ? (
                <div className="glass-panel border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-300">
                    {errorMessage}
                </div>
            ) : null}

            {isLoading ? <LoadingSpinner /> : null}

            {!isLoading ? (
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
                                        <th className="px-4 py-3 text-left text-cyan-300/80">
                                            <div className="inline-flex items-center gap-2">
                                                <span>Email</span>
                                                {renderSortButton("email")}
                                            </div>
                                        </th>
                                        <th className="px-4 py-3 text-left text-cyan-300/80">Address</th>
                                        <th className="px-4 py-3 text-center text-cyan-300/80">Overall Rating</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStores.map((store) => (
                                        <tr key={store.id} className="border-b border-slate-700/30 hover:bg-slate-700/20">
                                            <td className="px-4 py-3">{store.name}</td>
                                            <td className="px-4 py-3 text-slate-300">{store.email}</td>
                                            <td className="px-4 py-3 text-slate-400">{store.address}</td>
                                            <td className="px-4 py-3 text-center text-slate-300">
                                                {Number(store.overallRating || 0).toFixed(1)}
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredStores.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                                                No stores found.
                                            </td>
                                        </tr>
                                    ) : null}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs text-slate-400">
                            Showing {startIndex}-{endIndex} of {pagination.total}
                        </p>

                        <div className="flex items-center gap-2 whitespace-nowrap">
                            <button
                                onClick={() => fetchStores(pagination.page - 1, pagination.pageLimit, sort.sortBy, sort.sortOrder)}
                                disabled={pagination.page <= 1}
                                className="button-primary disabled:cursor-not-allowed disabled:opacity-50 text-xs"
                            >
                                Previous
                            </button>

                            <span className="px-2 text-xs text-slate-400">
                                Page {pagination.page} of {pagination.totalPages || 1}
                            </span>

                            <select
                                className="input-field w-20"
                                value={pagination.pageLimit}
                                onChange={(event) => fetchStores(1, Number(event.target.value), sort.sortBy, sort.sortOrder)}
                            >
                                {[10, 20, 50].map((size) => (
                                    <option key={size} value={size}>{size}</option>
                                ))}
                            </select>

                            <button
                                onClick={() => fetchStores(pagination.page + 1, pagination.pageLimit, sort.sortBy, sort.sortOrder)}
                                disabled={pagination.page >= (pagination.totalPages || 1)}
                                className="button-primary disabled:cursor-not-allowed disabled:opacity-50 text-xs"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </>
            ) : null}
        </div>
    );
}

export default AdminStoresPage;
