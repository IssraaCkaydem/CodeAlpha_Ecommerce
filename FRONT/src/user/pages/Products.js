
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { motion } from "framer-motion";
import axiosClient from "../../api/axiosClient";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom"; 
import "../../styles/Products.css";

export default function Products() {
  const navigate = useNavigate(); 
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 9; 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get(`/products?page=${currentPage}&limit=${limit}`);

        setProducts(res.data.products);
        setTotalPages(res.data.totalPages);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage]);

  if (loading) return <h2>Loading...</h2>;

  return (
    <div className="products-page">
      {/* ← Back Button */}
      <Button onClick={() => navigate("/")} style={{ marginBottom: "20px" }}>
        ← Back
      </Button>

      <h1 className="products-title">All Products</h1>

      <div className="products-grid">
        {products.map((p, i) => (
          <motion.div
            key={p._id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <ProductCard product={p} />
          </motion.div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        {[...Array(totalPages).keys()].map((num) => (
          <button
            key={num}
            className={currentPage === num + 1 ? "active" : ""}
            onClick={() => setCurrentPage(num + 1)}
          >
            {num + 1}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
