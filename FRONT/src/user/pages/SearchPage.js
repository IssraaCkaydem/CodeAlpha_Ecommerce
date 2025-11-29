import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import ProductCard from "../components/ProductCard"; // نفس التصميم
import { motion } from "framer-motion";
import "../../styles/Products.css"; // استخدمي نفس CSS عشان يكون كل شيء متطابق

export default function SearchPage() {
  const [results, setResults] = useState([]);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q");

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      try {
        const res = await axiosClient.get(`/search?q=${query}`);
        setResults(res.data);
      } catch (err) {
        console.error(err);
        setResults([]);
      }
    };

    fetchResults();
  }, [query]);

  if (!results || results.length === 0)
    return (
      <div className="search-page">
        <h2>Search results for "{query}"</h2>
        <p>No products found.</p>
      </div>
    );

  return (
    <div className="search-page">
      <h2>Search results for "{query}"</h2>
      <div className="products-grid">
        {results.map((product, index) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
