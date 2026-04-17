import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROLES } from "../config/navigation";
import ProtectedRoute from "../components/guards/ProtectedRoute";
import RoleRoute from "../components/guards/RoleRoute";
import AppShell from "../components/layout/AppShell";
import AdminDashboardPage from "../pages/dashboard/AdminDashboardPage";
import AdminStoresPage from "../pages/dashboard/AdminStoresPage";
import AdminUsersPage from "../pages/dashboard/AdminUsersPage";
import StoreOwnerDashboardPage from "../pages/dashboard/StoreOwnerDashboardPage";
import UserDashboardPage from "../pages/dashboard/UserDashboardPage";
import LoginPage from "../pages/auth/LoginPage";
import NotFoundPage from "../pages/NotFoundPage";
import ProfilePage from "../pages/profile/ProfilePage";
import SignUpPage from "../pages/auth/SignUpPage";

function HomeRedirect() {
    const { isAuthenticated, landingPath } = useAuth();

    return <Navigate to={isAuthenticated ? landingPath : "/login"} replace />;
}

function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />

            <Route element={<ProtectedRoute />}>
                <Route element={<AppShell />}>
                    <Route index element={<HomeRedirect />} />
                    <Route path="profile" element={<ProfilePage />} />

                    <Route element={<RoleRoute allowedRoles={[ROLES.SYSTEM_ADMINISTRATOR]} />}>
                        <Route path="dashboard/admin" element={<AdminDashboardPage />} />
                        <Route path="dashboard/admin/users" element={<AdminUsersPage />} />
                        <Route path="dashboard/admin/stores" element={<AdminStoresPage />} />
                    </Route>

                    <Route element={<RoleRoute allowedRoles={[ROLES.NORMAL_USER]} />}>
                        <Route path="dashboard/user" element={<UserDashboardPage />} />
                    </Route>

                    <Route element={<RoleRoute allowedRoles={[ROLES.STORE_OWNER]} />}>
                        <Route path="dashboard/store-ratings-summary" element={<StoreOwnerDashboardPage />} />
                    </Route>
                </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}

export default AppRoutes;