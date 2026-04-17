import { Link, useLocation, useNavigate } from "react-router-dom";
import { sidebarItemsByRole } from "../../config/navigation";
import { useAuth } from "../../context/AuthContext";

function Sidebar() {
    const { role, signOut } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const menuItems = (sidebarItemsByRole[role] || []).filter((item) => item.path !== "/profile");

    const handleSignOut = async () => {
        await signOut();
        navigate("/login", { replace: true });
    };

    return (
        <aside className="flex h-screen flex-col border-r border-white/10 bg-slate-950/90 px-4 py-5">
            <div className="mb-6 px-2">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Navigation</p>
                <h2 className="mt-2 text-lg font-semibold text-white">{role || "Workspace"}</h2>
            </div>

            <nav className="space-y-2">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);

                    return (
                        <Link
                            key={item.id}
                            to={item.path}
                            className={`block rounded-xl border px-3 py-3 transition ${isActive
                                ? "border-cyan-400/30 bg-cyan-500/10 text-white"
                                : "border-white/10 bg-white/5 text-slate-200 hover:border-cyan-400/20 hover:bg-white/10"
                                }`}
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <p className="text-sm font-semibold">{item.name}</p>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto space-y-2 pt-6">
                <Link
                    to="/profile"
                    className={`block rounded-xl border px-3 py-3 text-sm font-semibold transition ${location.pathname === "/profile"
                        ? "border-cyan-400/30 bg-cyan-500/10 text-white"
                        : "border-white/10 bg-white/5 text-slate-200 hover:border-cyan-400/20 hover:bg-white/10"
                        }`}
                >
                    Profile
                </Link>

                <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-3 text-left text-sm font-semibold text-red-200 transition hover:bg-red-500/20"
                >
                    Log Out
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;