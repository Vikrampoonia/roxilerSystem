import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

function ProfilePage() {
    const { session, updateProfile, isAuthenticated } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        password: "",
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (session?.user) {
            setFormData({
                name: session.user.name || "",
                address: session.user.address || "",
                password: "",
            });
        }
    }, [session]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((current) => ({ ...current, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setErrorMessage("");

        try {
            await updateProfile(formData);
            setFormData((current) => ({ ...current, password: "" }));
            setIsEditing(false);
        } catch (error) {
            setErrorMessage(error.message || "Unable to update profile");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between gap-4">
                <h1 className="section-title">Profile</h1>
                {!isEditing ? (
                    <button type="button" className="button-secondary" onClick={() => setIsEditing(true)}>
                        Edit
                    </button>
                ) : null}
            </div>

            <div className={`grid gap-6 ${isEditing ? "xl:grid-cols-2" : "max-w-2xl"}`}>
                <div className="glass-panel p-6">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Current profile</p>
                    <div className="mt-5 space-y-4">
                        <div>
                            <p className="text-sm text-slate-400">Name</p>
                            <p className="text-lg font-semibold text-white">{session?.user?.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-400">Email</p>
                            <p className="text-lg font-semibold text-white">{session?.user?.email}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-400">Role</p>
                            <p className="text-lg font-semibold text-white">{session?.user?.role}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-400">Address</p>
                            <p className="text-lg font-semibold text-white">{session?.user?.address || "Not set"}</p>
                        </div>
                    </div>
                </div>

                {isEditing ? (
                    <div className="glass-panel p-6">
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Edit profile</p>

                        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
                            <label className="block space-y-2">
                                <span className="text-sm text-slate-300">Name</span>
                                <input name="name" value={formData.name} onChange={handleChange} className="input-field" />
                            </label>

                            <label className="block space-y-2">
                                <span className="text-sm text-slate-300">Address</span>
                                <textarea name="address" value={formData.address} onChange={handleChange} className="input-field min-h-28 resize-none" />
                            </label>

                            <label className="block space-y-2">
                                <span className="text-sm text-slate-300">New password</span>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="Leave blank to keep current password"
                                />
                            </label>

                            {errorMessage ? <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{errorMessage}</p> : null}

                            <div className="flex items-center gap-3">
                                <button type="submit" className="button-primary" disabled={isSubmitting}>
                                    {isSubmitting ? "Saving..." : "Save profile"}
                                </button>
                                <button
                                    type="button"
                                    className="button-secondary"
                                    onClick={() => {
                                        setErrorMessage("");
                                        setIsEditing(false);
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                ) : null}
            </div>
        </div>
    );
}

export default ProfilePage;