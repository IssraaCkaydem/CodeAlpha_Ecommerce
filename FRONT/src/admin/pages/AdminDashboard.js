/*
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => navigate("/admin/orders")}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Manage Orders
        </button>

        <button
          onClick={() => navigate("/admin/add-product")}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Add Product
        </button>

        <button
          onClick={() => navigate("/admin/products")}
          style={{
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Manage Products
        </button>
      </div>
    </div>
  );
}
*/
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../../styles/AdminDashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <motion.div
      className="admin-container"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="admin-title">Admin Dashboard</h1>

      <motion.div
        className="admin-button-group"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <button className="admin-button" onClick={() => navigate("/admin/orders")}>
          Manage Orders
        </button>
        <button className="admin-button" onClick={() => navigate("/admin/add-product")}>
          Add Product
        </button>
        <button className="admin-button" onClick={() => navigate("/admin/products")}>
          Manage Products
        </button>
      </motion.div>
    </motion.div>
  );
}
