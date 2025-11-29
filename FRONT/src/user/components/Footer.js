import React, { useState } from "react";
import { Box, Typography, TextField, Button, IconButton } from "@mui/material";
import { motion } from "framer-motion";
import { FaFacebook, FaInstagram, FaTwitter, FaTiktok } from "react-icons/fa";
import "../../styles/Footer.css";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if (!email) return alert("Please enter your email!");
    alert(`Subscribed with ${email}`);
    setEmail("");
  };

  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="footer"
    >
      <Box className="footer-container">
        {/* Contact */}
        <Box className="footer-section">
          <Typography variant="h6" gutterBottom>Contact Us</Typography>
          <Typography>Email: support@myshop.com</Typography>
          <Typography>Phone: +961 70 123 456</Typography>
          <Typography>Address: Beirut, Lebanon</Typography>
        </Box>

        {/* About */}
        <Box className="footer-section">
          <Typography variant="h6" gutterBottom>About</Typography>
          <Typography>We are a leading online store providing top-quality products at the best prices.</Typography>
        </Box>

        {/* Policies */}
        <Box className="footer-section">
          <Typography variant="h6" gutterBottom>Policies</Typography>
          <Typography>Privacy Policy</Typography>
          <Typography>Return & Refund Policy</Typography>
          <Typography>Terms of Service</Typography>
        </Box>

        {/* Newsletter + Social */}
        <Box className="footer-section">
          <Typography variant="h6" gutterBottom>Newsletter</Typography>
          <Box display="flex" mb={1}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ backgroundColor: "#fff", borderRadius: 1, mr: 1, flex: 1 }}
            />
            <Button variant="contained" onClick={handleSubscribe}>Subscribe</Button>
          </Box>
          <Typography variant="subtitle1" gutterBottom>Follow us</Typography>
          <Box>
            <IconButton><FaFacebook color="#4267B2" /></IconButton>
            <IconButton><FaInstagram color="#C13584" /></IconButton>
            <IconButton><FaTwitter color="#1DA1F2" /></IconButton>
            <IconButton><FaTiktok color="#000" /></IconButton>
          </Box>
        </Box>
      </Box>

      <Box className="footer-bottom">
        <Typography>© 2025 MyShop. All rights reserved.</Typography>
      </Box>
    </motion.footer>
  );
}
