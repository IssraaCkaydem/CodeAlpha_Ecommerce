
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

export default function LogoutButton() {
  const navigate = useNavigate();
  const { setIsAuthenticated, setUser } = useAuth();
  const handleLogout = async () => {
    try {
      await logout();
      setIsAuthenticated(false);
      setUser(null);
      navigate("/"); 
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };
  

  return (
    <Button onClick={handleLogout} variant="contained" color="primary">
      Logout
    </Button>
  );
}
