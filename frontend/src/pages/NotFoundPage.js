import { Link } from "react-router-dom";

function NotFoundPage() {
    return (
        <div className="flex min-h-screen items-center justify-center px-6">
            <div className="glass-panel max-w-lg p-8 text-center">
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">404</p>
                <h1 className="mt-4 text-3xl font-black text-white">Page not found</h1>
                <p className="mt-3 text-sm text-slate-400">The route is not available in the current frontend shell.</p>
                <Link to="/" className="button-primary mt-6 inline-flex">
                    Go home
                </Link>
            </div>
        </div>
    );
}

export default NotFoundPage;