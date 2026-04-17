import { useEffect, useMemo, useState } from "react";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import adminService from "../../service/adminService";
import { validateAddress, validateEmail, validateName, validatePassword } from "../../utils/validation";

function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [pagination, setPagination] = useState({ page: 1, pageLimit: 10, total: 0, totalPages: 1 });
    const [sort, setSort] = useState({ sortBy: "", sortOrder: "" });
    const [isCreating, setIsCreating] = useState(false);
    const [isCreatingUser, setIsCreatingUser] = useState(false);
    const [createErrorMessage, setCreateErrorMessage] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedUserLoading, setSelectedUserLoading] = useState(false);
    const [selectedUserError, setSelectedUserError] = useState("");
    const [createForm, setCreateForm] = useState({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "Normal User",
    });

    const fetchUsers = async (page = 1, pageLimit = pagination.pageLimit, sortBy = sort.sortBy, sortOrder = sort.sortOrder) => {
        setIsLoading(true);
        setErrorMessage("");
        try {
            const response = await adminService.getUsers({ page, pageLimit, sortBy, sortOrder });
            const data = response?.data || {};
            const list = data.list || [];
            setUsers(list);
            setPagination({
                page: data.page || page,
                pageLimit: data.pageLimit || pageLimit,
                total: data.total || 0,
                totalPages: data.totalPages || 1,
            });
        } catch (error) {
            setErrorMessage(error.message || "Unable to load users");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(1, pagination.pageLimit, sort.sortBy, sort.sortOrder);
    }, []);

    const applySort = async (sortBy, sortOrder) => {
        setSort({ sortBy, sortOrder });
        await fetchUsers(1, pagination.pageLimit, sortBy, sortOrder);
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

    const handleCreateUser = async (event) => {
        event.preventDefault();
        setIsCreatingUser(true);
        setCreateErrorMessage("");

        const nameError = validateName(createForm.name);
        const emailError = validateEmail(createForm.email);
        const addressError = validateAddress(createForm.address);
        const passwordError = validatePassword(createForm.password);
        const firstError = nameError || emailError || addressError || passwordError;

        if (firstError) {
            setCreateErrorMessage(firstError);
            setIsCreatingUser(false);
            return;
        }

        try {
            await adminService.createUser(createForm);
            setCreateForm({
                name: "",
                email: "",
                password: "",
                address: "",
                role: "Normal User",
            });
            setIsCreating(false);
            await fetchUsers(1, pagination.pageLimit, sort.sortBy, sort.sortOrder);
        } catch (error) {
            setCreateErrorMessage(error.message || "Unable to create user");
        } finally {
            setIsCreatingUser(false);
        }
    };

    const handleViewDetails = async (userId) => {
        setSelectedUserLoading(true);
        setSelectedUserError("");

        try {
            const response = await adminService.getUserById(userId);
            setSelectedUser(response?.data || null);
        } catch (error) {
            setSelectedUser(null);
            setSelectedUserError(error.message || "Unable to load user details");
        } finally {
            setSelectedUserLoading(false);
        }
    };

    const filteredUsers = useMemo(() => {
        const needle = searchTerm.trim().toLowerCase();
        if (!needle) {
            return users;
        }

        return users.filter((user) =>
            [user.name, user.email, user.address, user.role]
                .filter(Boolean)
                .some((value) => String(value).toLowerCase().includes(needle))
        );
    }, [searchTerm, users]);

    const startIndex = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.pageLimit + 1;
    const endIndex = Math.min(pagination.page * pagination.pageLimit, pagination.total);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="section-title">Users Management</h1>
                    <p className="section-subtitle">View all normal users, store owners, and admins.</p>
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
                        {isCreating ? "Close" : "Add User"}
                    </button>

                    <div className="w-full sm:w-64">
                        <input
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            className="input-field"
                            placeholder="Search name, email, role"
                        />
                    </div>
                </div>
            </div>

            {isCreating ? (
                <div className="glass-panel p-5">
                    <p className="text-sm font-semibold text-white">Add New User</p>
                    <form className="mt-4 grid gap-4 sm:grid-cols-2" onSubmit={handleCreateUser}>
                        <label className="block space-y-2 sm:col-span-2">
                            <span className="text-sm text-slate-300">Name</span>
                            <input name="name" value={createForm.name} onChange={handleCreateChange} className="input-field" required />
                        </label>

                        <label className="block space-y-2">
                            <span className="text-sm text-slate-300">Email</span>
                            <input type="email" name="email" value={createForm.email} onChange={handleCreateChange} className="input-field" required />
                        </label>

                        <label className="block space-y-2">
                            <span className="text-sm text-slate-300">Role</span>
                            <select name="role" value={createForm.role} onChange={handleCreateChange} className="input-field" required>
                                <option>Normal User</option>
                                <option>Store Owner</option>
                                <option>System Administrator</option>
                            </select>
                        </label>

                        <label className="block space-y-2 sm:col-span-2">
                            <span className="text-sm text-slate-300">Password</span>
                            <input type="password" name="password" value={createForm.password} onChange={handleCreateChange} className="input-field" required />
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

                        <button type="submit" className="button-primary sm:col-span-2" disabled={isCreatingUser}>
                            {isCreatingUser ? "Creating user..." : "Create User"}
                        </button>
                    </form>
                </div>
            ) : null}

            {errorMessage ? (
                <div className="glass-panel border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-300">
                    {errorMessage}
                </div>
            ) : null}

            {selectedUser || selectedUserLoading || selectedUserError ? (
                <div className="glass-panel p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">User Details</p>
                            <h2 className="mt-2 text-xl font-semibold text-white">
                                {selectedUser?.name || "Selected user"}
                            </h2>
                        </div>
                        <button
                            type="button"
                            className="button-secondary text-xs"
                            onClick={() => {
                                setSelectedUser(null);
                                setSelectedUserError("");
                            }}
                        >
                            Close
                        </button>
                    </div>

                    {selectedUserLoading ? <LoadingSpinner /> : null}

                    {selectedUserError ? (
                        <p className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                            {selectedUserError}
                        </p>
                    ) : null}

                    {selectedUser && !selectedUserLoading ? (
                        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <p className="text-sm text-slate-400">Name</p>
                                <p className="text-lg font-semibold text-white">{selectedUser.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Email</p>
                                <p className="text-lg font-semibold text-white">{selectedUser.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Role</p>
                                <p className="text-lg font-semibold text-white">{selectedUser.role}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Address</p>
                                <p className="text-lg font-semibold text-white">{selectedUser.address}</p>
                            </div>
                            {selectedUser.role === "Store Owner" ? (
                                <div className="sm:col-span-2 lg:col-span-4">
                                    <p className="text-sm text-slate-400">Store Rating</p>
                                    <p className="text-lg font-semibold text-amber-300">
                                        {Number(selectedUser.storeRating || 0).toFixed(1)}
                                    </p>
                                </div>
                            ) : null}
                        </div>
                    ) : null}
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
                                                <span>Name</span>
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
                                        <th className="px-4 py-3 text-left text-cyan-300/80">Role</th>
                                        <th className="px-4 py-3 text-center text-cyan-300/80">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className="border-b border-slate-700/30 hover:bg-slate-700/20">
                                            <td className="px-4 py-3">{user.name}</td>
                                            <td className="px-4 py-3 text-slate-300">{user.email}</td>
                                            <td className="px-4 py-3 text-slate-400">{user.address}</td>
                                            <td className="px-4 py-3 text-slate-300">{user.role}</td>
                                            <td className="px-4 py-3 text-center">
                                                <button
                                                    type="button"
                                                    className="button-primary text-xs"
                                                    onClick={() => handleViewDetails(user.id)}
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                                                No users found.
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
                                onClick={() => fetchUsers(pagination.page - 1, pagination.pageLimit, sort.sortBy, sort.sortOrder)}
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
                                onChange={(event) => fetchUsers(1, Number(event.target.value), sort.sortBy, sort.sortOrder)}
                            >
                                {[10, 20, 50].map((size) => (
                                    <option key={size} value={size}>{size}</option>
                                ))}
                            </select>

                            <button
                                onClick={() => fetchUsers(pagination.page + 1, pagination.pageLimit, sort.sortBy, sort.sortOrder)}
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

export default AdminUsersPage;
