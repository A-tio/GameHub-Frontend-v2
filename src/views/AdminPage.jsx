import "../styles/AdminPage.css";

import { Outlet, useNavigate } from "react-router-dom";
import { UseAuthContext } from "../contexts/authContext";
import { useAlertContext } from "../contexts/alertContext";

function AdminPage() {
  const alert = useAlertContext();
  const { user, logout } = UseAuthContext();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate('/home');
  };

  if (!user) {
    alert.error('not authed user!');
    handleSignOut();
    return null;
  }

  if (user.role !== 'admin') {
    alert.error('not authed user!');
    handleSignOut();
    return null;
  }

  return (
    <Outlet />
  );
}

export default AdminPage;
