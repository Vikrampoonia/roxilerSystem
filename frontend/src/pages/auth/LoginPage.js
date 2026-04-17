import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function LoginPage() {
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState(() => ({
        email: location.state?.email || "",
        password: "",
    }));

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((current) => ({ ...current, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setErrorMessage("");

        try {
            const response = await signIn(formData);
            const role = response?.data?.user?.role || response?.user?.role;
            const nextPath = role === "System Administrator"
                ? "/dashboard/admin"
                : role === "Store Owner"
                    ? "/dashboard/store-ratings-summary"
                    : "/dashboard/user";

            navigate(location.state?.from?.pathname || nextPath, { replace: true });
        } catch (error) {
            setErrorMessage(error.message || "Unable to login");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,#0f172a_0%,#020617_55%,#000_100%)] px-6 py-10 sm:px-8">
            <section className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md items-center justify-center">
                <div className="glass-panel w-full p-6 sm:p-8">
                    <h1 className="text-3xl font-bold tracking-tight text-white">Login</h1>
                    <p className="mt-2 text-sm text-slate-400">
                        Sign in with your account credentials.
                    </p>

                    <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                        <label className="block space-y-2">
                            <span className="text-sm text-slate-300">Email</span>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="name@example.com"
                                required
                            />
                        </label>

                        <label className="block space-y-2">
                            <span className="text-sm text-slate-300">Password</span>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="••••••••"
                                required
                            />
                        </label>

                        {errorMessage ? <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{errorMessage}</p> : null}

                        <button type="submit" className="button-primary w-full" disabled={isSubmitting}>
                            {isSubmitting ? "Signing in..." : "Sign in"}
                        </button>
                    </form>

                    <p className="mt-6 text-sm text-slate-400">
                        Need an account?{" "}
                        <Link to="/signup" className="font-semibold text-cyan-300 hover:text-cyan-200">
                            Create one
                        </Link>
                    </p>
                </div>
            </section>
        </div>
    );
}

export default LoginPage;