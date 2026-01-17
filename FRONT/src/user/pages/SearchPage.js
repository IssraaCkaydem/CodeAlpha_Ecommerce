

 import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import ProductCard from "../components/ProductCard";
import { searchProducts } from "../../services/searchService";

export default function SearchPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get("q");

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      try {
        setLoading(true);
        const data = await searchProducts(query);
        setResults(data);
      } catch (err) {
        if (err.message === "UNAUTHORIZED") {
          navigate("/login", {
            state: { from: location.pathname + location.search },
          });
        } else {
          setResults([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, navigate, location]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white text-xl sm:text-2xl">Loading...</p>
      </div>
    );

  if (!results || results.length === 0)
    return (
      <div className="min-h-screen p-5 sm:p-8 md:p-10 bg-gradient-to-br from-sky-500 via-emerald-400 to-white flex flex-col items-center justify-center">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-white font-semibold hover:text-white/80"
        >
          ← Back
        </button>

        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-white text-center">
          Search results for "{query}"
        </h2>

        <p className="text-gray-700">No products found.</p>
      </div>
    );

  return (
    <div className="min-h-screen p-5 sm:p-8 md:p-10 bg-gradient-to-br from-sky-500 via-emerald-400 to-white">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-white font-semibold hover:text-white/80"
      >
        ← Back
      </button>

      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-10 text-center text-white">
        Search results for "{query}"
      </h2>

      <div className="grid gap-5 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {results.map((product, index) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.07 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

