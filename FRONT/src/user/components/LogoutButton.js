
import { Button } from "@mui/material";
import axiosClient from "../../api/axiosClient"; 
import { useNavigate } from "react-router-dom";

export default function LogoutButton({ setIsAuthenticated }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axiosClient.post("/auth/logout"); 

      setIsAuthenticated(false);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err.response?.data || err.message);
    }
  };

  return (
    <Button onClick={handleLogout} variant="contained" color="primary">
      Logout
    </Button>
  );
}

