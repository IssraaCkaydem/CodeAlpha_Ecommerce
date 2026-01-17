
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@mui/material";

import ProductCard from "../components/ProductCard";
import { fetchProducts } from "../../services/productService";

export default function Products() {
  const navigate = useNavigate();
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const limit = 9;

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);

        const searchParams = new URLSearchParams(location.search);
        const category = searchParams.get("category") || "all";
        const min = searchParams.get("min") || "";
        const max = searchParams.get("max") || "";

        const data = await fetchProducts({
          category,
          page: currentPage,
          limit,
          min,
          max,
        });

        setProducts(data.products);
        setTotalPages(data.totalPages);
      } catch (err) {
        if (err.message === "UNAUTHORIZED") {
          navigate("/login", { state: { from: location.pathname } });
        }
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [currentPage, location.search, navigate]);

  if (loading)
    return (
      <h2 className="text-center text-xl sm:text-2xl mt-20 text-white">
        Loading...
      </h2>
    );

  const applyFilter = () => {
    const searchParams = new URLSearchParams(location.search);

    minPrice ? searchParams.set("min", minPrice) : searchParams.delete("min");
    maxPrice ? searchParams.set("max", maxPrice) : searchParams.delete("max");

    navigate(`/products?${searchParams.toString()}`);
  };

  const category =
    new URLSearchParams(location.search).get("category") || "All";

  return (
    <div className="min-h-screen px-5 sm:px-8 md:px-10 py-6 sm:py-8 md:py-10 bg-gradient-to-br from-sky-500 via-emerald-400 to-white">

      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-white font-semibold"
      >
        ← Back
      </button>

      <div className="flex flex-col md:flex-row md:justify-between gap-6 mb-10">
        <h1 className="text-xl sm:text-2xl md:text-[2.4rem] font-bold text-white capitalize">
          {category} Products
        </h1>

        <div className="flex gap-3 bg-white/80 p-4 rounded-xl">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-24 px-2 py-1 border rounded"
          />

          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-24 px-2 py-1 border rounded"
          />

          <Button onClick={applyFilter} variant="contained" size="small">
            Apply
          </Button>
        </div>
      </div>

      {products.length === 0 ? (
        <h2 className="text-center text-white mt-20">
          No products found
        </h2>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p, i) => (
            <motion.div
              key={p._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
        </div>
      )}

      <div className="flex justify-center gap-2 mt-10">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-white rounded disabled:opacity-40"
        >
          Previous
        </button>

        {[...Array(totalPages).keys()].map((n) => (
          <button
            key={n}
            onClick={() => setCurrentPage(n + 1)}
            className={`px-4 py-2 rounded ${
              currentPage === n + 1
                ? "bg-blue-600 text-white"
                : "bg-white"
            }`}
          >
            {n + 1}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-white rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
