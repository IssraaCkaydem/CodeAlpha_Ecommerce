
import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import { motion } from "framer-motion";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom"; 
import "../../styles/WishlistPage.css";

export default function WishlistPage() {
  const navigate = useNavigate(); 
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Wishlist
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await axiosClient.get("/wishlist", {
          withCredentials: true,
        });

        const items = res.data.items || [];
        setWishlist(Array.isArray(items) ? items : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  // REMOVE From Wishlist
  const removeFromWishlist = async (productId) => {
    try {
      const res = await axiosClient.post(
        "/wishlist/remove",
        { productId },
        { withCredentials: true }
      );

      const updated = res.data.items || [];
      setWishlist(Array.isArray(updated) ? updated : []);
    } catch (err) {
      console.error("Remove failed:", err);
    }
  };

  if (loading)
    return (
      <div className="wishlist-loading">
        <CircularProgress />
      </div>
    );

  return (
    <div className="wishlist-page">
      {/* ← Back Button */}
      <Button
        onClick={() => navigate("/")}
        style={{ marginBottom: "20px" }}
      >
        ← Back
      </Button>

      <motion.h1
        className="wishlist-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        ❤️ Your Wishlist
      </motion.h1>

      {wishlist.length === 0 ? (
        <motion.p
          className="wishlist-empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Your wishlist is empty.
        </motion.p>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map((item) => (
            <motion.div
              key={item._id}
              className="wishlist-card-wrapper"
              whileHover={{ scale: 1.03 }}
            >
              <Card className="wishlist-card">
                
                <div className="wishlist-image-box">
                  <img
                    src={item.imageUrl || "/fallback.png"}
                    alt={item.name}
                    className="wishlist-img"
                  />
                </div>

                <CardContent>
                  <Typography variant="h6" className="wishlist-name">
                    {item.name}
                  </Typography>

                  <Typography variant="body1" className="wishlist-price">
                    ${item.price}
                  </Typography>

                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => removeFromWishlist(item._id)}
                    className="remove-btn"
                  >
                    Remove
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

