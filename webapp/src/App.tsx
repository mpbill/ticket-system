import Container from "@mui/material/Container";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "./Auth";
import ToolbarComponent from "./ToolbarComponent";


export function App() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout().then(() => {
      navigate('/login');
    });
  }
  return (

    <Container maxWidth="sm">
      <ToolbarComponent user={user} logout={handleLogout} />
      <Outlet />
    </Container>
  );
}
