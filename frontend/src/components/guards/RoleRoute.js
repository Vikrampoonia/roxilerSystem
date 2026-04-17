import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function RoleRoute({ allowedRoles }) {
    const { role, landingPath } = useAuth();

    if (!allowedRoles.includes(role)) {
        return <Navigate to={landingPath} replace />;
    }

    return <Outlet />;
}

export default RoleRoute;