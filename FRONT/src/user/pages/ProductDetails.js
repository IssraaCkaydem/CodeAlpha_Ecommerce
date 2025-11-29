
import { useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import { FaHeart } from "react-icons/fa";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export default function ProductDetails() {
  const { id } = useParams();
  const { data: product, loading } = useFetch(`/products/${id}`);
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    // Check if product is already in wishlist
    const checkWishlist = async () => {
      try {
        const res = await axiosClient.get("/wishlist", { withCredentials: true });
        const isLiked = res.data.items.some(item => item._id === id);
        setLiked(isLiked);
      } catch (err) {
        console.error(err);
      }
    };
    checkWishlist();
  }, [id]);

  if (loading) return <h2>Loading...</h2>;
  if (!product) return <h2>Product not found</h2>;

  const handleAddToCart = async () => {
    try {
      await axiosClient.post(
        "/cart/add",
        { productId: product._id, quantity },
        { withCredentials: true }
      );
      setSnackbar({ open: true, message: `${product.name} added to cart!`, severity: "success" });
    } catch (err) {
      setSnackbar({ open: true, message: "Failed to add to cart", severity: "error" });
      console.error(err);
    }
  };

  const handleAddToWishlist = async () => {
    try {
      if (!liked) {
        await axiosClient.post("/wishlist/add", { productId: product._id }, { withCredentials: true });
        setLiked(true);
        setSnackbar({ open: true, message: "Added to wishlist!", severity: "success" });
      } else {
        await axiosClient.post("/wishlist/remove", { productId: product._id }, { withCredentials: true });
        setLiked(false);
        setSnackbar({ open: true, message: "Removed from wishlist!", severity: "info" });
      }
    } catch (err) {
      setSnackbar({ open: true, message: "Failed to update wishlist", severity: "error" });
      console.error(err);
    }
  };

  return (
    <div style={{ display: "flex", padding: "20px", gap: "40px" }}>
      <div>
        <img
          src={product.imageUrl || product.image || "/fallback.png"}
          alt={product.name}
          style={{ width: 400, height: 400, objectFit: "contain", borderRadius: 12 }}
        />
      </div>
      <div style={{ flex: 1 }}>
        <h1>{product.name}</h1>
        <h2>${product.price}</h2>
        <p>{product.description}</p>
        <p><b>Category: </b>{product.category}</p>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 15 }}>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            style={{
              width: 60,
              padding: "8px",
              borderRadius: 6,
              border: "1px solid #ccc",
            }}
          />
          <button
            onClick={handleAddToCart}
            style={{
              padding: "10px 20px",
              borderRadius: 8,
              border: "none",
              background: "linear-gradient(45deg, #1e90ff, #00fa9a, #ffffff)",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Add to Cart
          </button>

          <FaHeart
            onClick={handleAddToWishlist}
            style={{
              fontSize: 28,
              cursor: "pointer",
              color: liked ? "#ff0000" : "#aaa",
              marginLeft: 10,
            }}
          />
        </div>
      </div>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
