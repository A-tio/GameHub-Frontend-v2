import { Outlet, useNavigate } from "react-router-dom";
import { UseAuthContext } from "../contexts/authContext";
import { useEffect } from "react";

export default function GuestLayout() {

    const { user, token } = UseAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (!token || !user) {
            navigate('/login');
        }
    }, [token, user, navigate]);

    return (
        <div className="main-box">
            <Outlet />
        </div>
    );
}
