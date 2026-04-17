import { useAuth } from "../../context/AuthContext";

function Navbar() {
    const { name } = useAuth();

    return (
        <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/70 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-cyan-300/80">Roxiler System</p>
                    <h1 className="text-base font-semibold text-white sm:text-lg">Store Rating Portal</h1>
                </div>

                <div className="text-right">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">User</p>
                    <p className="text-sm font-semibold text-white sm:text-base">{name || "-"}</p>
                </div>
            </div>
        </header>
    );
}

export default Navbar;