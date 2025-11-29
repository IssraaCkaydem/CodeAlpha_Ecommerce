
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ setIsAuthenticated }) {
  return (
    <>
      <Navbar setIsAuthenticated={setIsAuthenticated} />
      <div className="page-container">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
