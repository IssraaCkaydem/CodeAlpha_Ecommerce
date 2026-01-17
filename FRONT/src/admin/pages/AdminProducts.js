

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axiosClient from "../../api/axiosClient";

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
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosClient.get(
          `/products?page=${currentPage}&limit=${itemsPerPage}`
        );
        setProducts(res.data.products);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    };
    fetchProducts();
  }, [currentPage]);

  const confirmDelete = (id) => {
    setSelectedId(id);
    setOpenDialog(true);
  };

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

  const handleEdit = (id) => navigate(`/admin/edit-product/${id}`);

  return (
    <div className="min-h-screen p-10 bg-gradient-to-br from-sky-500 via-emerald-400 to-white">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-white/90 hover:text-white transition"
      >
        ← Back
      </button>

      <h1 className="text-center text-4xl font-extrabold mb-8 text-white drop-shadow-lg">
        Admin Products
      </h1>

      {message && <p className="mb-4 text-green-600 text-center">{message}</p>}

      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6">
        {Array.isArray(products) && products.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-4 py-2 text-left">Name</th>
                    <th className="border px-4 py-2 text-left">Price</th>
                    <th className="border px-4 py-2 text-left">Category</th>
                    <th className="border px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <motion.tr
                      key={p._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="border px-4 py-2">{p.name}</td>
                      <td className="border px-4 py-2">${p.price}</td>
                      <td className="border px-4 py-2">{p.category}</td>
                      <td className="border px-4 py-2">
                        <button
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded mr-2"
                          onClick={() => handleEdit(p._id)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                          onClick={() => confirmDelete(p._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-4 gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border disabled:opacity-50"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  className={`px-3 py-1 rounded border ${
                    currentPage === num
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white text-gray-700"
                  }`}
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
                className="px-3 py-1 rounded border disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <p className="italic mt-4 text-center text-gray-600">No products found</p>
        )}
      </div>

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
    </div>
  );
}
