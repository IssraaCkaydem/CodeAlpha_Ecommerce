
import "../../styles/AdminProducts.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { motion } from "framer-motion";

// MUI components
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

export default function AdminProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");

  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // Fetch products with backend pagination
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosClient.get(
          `/products?page=${currentPage}&limit=${itemsPerPage}`
        );

        console.log("Backend response:", res.data);

        setProducts(res.data.products); 
        setTotalPages(res.data.totalPages);

      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    };

    fetchProducts();
  }, [currentPage]);


  // Open delete confirmation dialog
  const confirmDelete = (id) => {
    setSelectedId(id);
    setOpenDialog(true);
  };

  // Delete product
  const handleDelete = async () => {
    try {
      await axiosClient.delete(`/products/${selectedId}`, {
        withCredentials: true,
      });

      setProducts((prev) => prev.filter((p) => p._id !== selectedId));
      setMessage("Product deleted successfully");

    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage("Error deleting product");
    } finally {
      setOpenDialog(false);
      setSelectedId(null);
    }
  };

  // Edit product
  const handleEdit = (id) => navigate(`/admin/edit-product/${id}`);


  return (
    <motion.div
      className="container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
    >
      <h1>Admin Products</h1>
      {message && <p className="message">{message}</p>}

      {Array.isArray(products) && products.length > 0 ? (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <motion.tr
                  key={p._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td>{p.name}</td>
                  <td>${p.price}</td>
                  <td>{p.category}</td>
                  <td>
                    <button
                      className="action-btn"
                      onClick={() => handleEdit(p._id)}
                    >
                      Edit
                    </button>

                    <button
                      className="action-btn delete-btn"
                      onClick={() => confirmDelete(p._id)}
                    >
                      Delete
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="pagination">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                className={currentPage === num ? "active" : ""}
                onClick={() => setCurrentPage(num)}
              >
                {num}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p className="no-products">No products found</p>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>

        <DialogContent>
          <p>Are you sure you want to delete this product?</p>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
}
