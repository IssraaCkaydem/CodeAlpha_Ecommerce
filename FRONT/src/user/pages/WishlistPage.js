
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CircularProgress from "@mui/material/CircularProgress";
import { getWishlist, removeFromWishlist as removeFromWishlistService } from "../../services/wishlistService";

export default function WishlistPage() {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await getWishlist();
        setWishlist(res.items || []);
      } catch (err) {
        console.error(err);
        if (err.message.includes("Unauthorized")) {
          navigate("/login", { state: { from: "/wishlist" } });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [navigate]);

  const removeFromWishlist = async (productId) => {
    try {
      const res = await removeFromWishlistService(productId);
      setWishlist(res.items || []);
    } catch (err) {
      console.error(err);
      if (err.message.includes("Unauthorized")) {
        navigate("/login", { state: { from: "/wishlist" } });
      }
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </div>
    );

  return (
    <div className="min-h-screen p-5 sm:p-8 md:p-10 bg-gradient-to-br from-sky-500 via-emerald-400 to-white">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 sm:mb-6 flex items-center gap-2 text-white/90 hover:text-white transition font-semibold text-sm sm:text-base"
      >
        ← Back
      </button>

      <motion.h1
        className="text-center text-2xl sm:text-3xl md:text-[2.6rem] font-extrabold mb-6 sm:mb-10 text-white drop-shadow-lg"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Your Wishlist
      </motion.h1>

      {wishlist.length === 0 ? (
        <motion.p
          className="text-center text-sm sm:text-base md:text-xl text-white/90 mt-8 sm:mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Your wishlist is empty 💔
        </motion.p>
      ) : (
        <div className="grid gap-5 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {wishlist.map((item, i) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-2xl bg-white shadow-lg hover:shadow-2xl transition flex flex-col"
            >
              <div className="h-[180px] sm:h-[200px] md:h-[220px] bg-gray-50 flex items-center justify-center">
                <img
                  src={item.imageUrl || "/fallback.png"}
                  alt={item.name}
                  className="max-h-[90%] object-contain"
                />
              </div>

              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="font-bold text-sm sm:text-base md:text-lg text-gray-800 mb-1 truncate">
                    {item.name}
                  </h2>
                  <p className="text-blue-600 font-bold text-sm sm:text-base md:text-lg mb-3 sm:mb-4">
                    ${item.price}
                  </p>
                </div>

                <button
                  onClick={() => removeFromWishlist(item._id)}
                  className="w-full py-2 sm:py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 transition text-sm sm:text-base"
                >
                  Remove
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
// src/pages/WishlistPage.jsx

