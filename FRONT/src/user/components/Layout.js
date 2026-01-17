

import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CategoryNavbar from "./CategoryNavbar";

export default function Layout({ setIsAuthenticated }) {
  const location = useLocation();

  const showCategoryBar = location.pathname === "/products";

  return (
    <>
      <Navbar setIsAuthenticated={setIsAuthenticated} />
      {showCategoryBar && <CategoryNavbar />}
      <div className="page-container">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
