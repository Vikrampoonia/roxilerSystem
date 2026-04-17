import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { validateAddress, validateEmail, validateName, validatePassword } from "../../utils/validation";

function SignUpPage() {
    const { signUp } = useAuth();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        address: "",
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((current) => ({ ...current, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setErrorMessage("");

        const nameError = validateName(formData.name);
        const emailError = validateEmail(formData.email);
        const addressError = validateAddress(formData.address);
        const passwordError = validatePassword(formData.password);
        const firstError = nameError || emailError || addressError || passwordError;

        if (firstError) {
            setErrorMessage(firstError);
            setIsSubmitting(false);
            return;
        }

        try {
            await signUp(formData);
            navigate("/login", {
                replace: true,
                state: { email: formData.email },
            });
        } catch (error) {
            setErrorMessage(error.message || "Unable to sign up");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,#0f172a_0%,#020617_55%,#000_100%)] px-6 py-10 sm:px-8">
            <section className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-lg items-center justify-center">
                <div className="glass-panel w-full p-6 sm:p-8">
                    <h1 className="text-3xl font-bold tracking-tight text-white">Sign up</h1>
                    <p className="mt-2 text-sm text-slate-400">Create your account to start rating stores.</p>

                    <form className="mt-8 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
                        <label className="block space-y-2 sm:col-span-2">
                            <span className="text-sm text-slate-300">Name</span>
                            <input name="name" value={formData.name} onChange={handleChange} className="input-field" placeholder="Full name" required />
                        </label>

                        <label className="block space-y-2 sm:col-span-2">
                            <span className="text-sm text-slate-300">Email</span>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-field" placeholder="name@example.com" required />
                        </label>

                        <label className="block space-y-2 sm:col-span-2">
                            <span className="text-sm text-slate-300">Password</span>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} className="input-field" placeholder="••••••••" required />
                        </label>

                        <label className="block space-y-2 sm:col-span-2">
                            <span className="text-sm text-slate-300">Address</span>
                            <textarea name="address" value={formData.address} onChange={handleChange} className="input-field min-h-28 resize-none" placeholder="Current address" required />
                        </label>

                        {errorMessage ? <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200 sm:col-span-2">{errorMessage}</p> : null}

                        <button type="submit" className="button-primary sm:col-span-2" disabled={isSubmitting}>
                            {isSubmitting ? "Creating account..." : "Create account"}
                        </button>
                    </form>

                    <p className="mt-6 text-sm text-slate-400">
                        Already have an account?{" "}
                        <Link to="/login" className="font-semibold text-cyan-300 hover:text-cyan-200">
                            Login
                        </Link>
                    </p>
                </div>
            </section>
        </div>
    );
}

export default SignUpPage;