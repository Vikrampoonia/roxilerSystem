import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function AppShell() {
    return (
        <div className="min-h-screen lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
            <Sidebar />

            <div className="min-w-0">
                <Navbar />
                <main className="px-4 py-4 sm:px-6 lg:px-8">
                    <section className="glass-panel min-h-[calc(100vh-6.5rem)] p-5 sm:p-6 lg:p-8">
                        <Outlet />
                    </section>
                </main>
            </div>
        </div>
    );
}

export default AppShell;