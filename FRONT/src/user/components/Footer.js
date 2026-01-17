
import React, { useState } from "react";
import { Box, Typography, TextField, Button, IconButton } from "@mui/material";
import { motion } from "framer-motion";
import { FaFacebook, FaInstagram, FaTwitter, FaTiktok } from "react-icons/fa";

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
      className="bg-gradient-to-br from-blue-500 to-green-400 text-white px-5 pt-10 pb-5"
    >
      <Box className="max-w-6xl mx-auto flex flex-wrap justify-between">
        
        <Box className="flex-1 min-w-[220px] m-2">
          <Typography variant="h6" className="font-bold mb-2">
            Contact Us
          </Typography>
          <Typography className="my-1">Email: support@myshop.com</Typography>
          <Typography className="my-1">Phone: +961 70 123 456</Typography>
          <Typography className="my-1">Address: Beirut, Lebanon</Typography>
        </Box>

        <Box className="flex-1 min-w-[220px] m-2">
          <Typography variant="h6" className="font-bold mb-2">
            About
          </Typography>
          <Typography className="my-1">
            We are a leading online store providing top-quality products at the best prices.
          </Typography>
        </Box>

        <Box className="flex-1 min-w-[220px] m-2">
          <Typography variant="h6" className="font-bold mb-2">
            Policies
          </Typography>
          <Typography className="my-1">Privacy Policy</Typography>
          <Typography className="my-1">Return & Refund Policy</Typography>
          <Typography className="my-1">Terms of Service</Typography>
        </Box>

        <Box className="flex-1 min-w-[220px] m-2">
          <Typography variant="h6" className="font-bold mb-2">
            Newsletter
          </Typography>

          <Box className="flex mb-2">
            <TextField
              variant="outlined"
              size="small"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white rounded mr-2 flex-1"
            />
            <Button
              variant="contained"
              onClick={handleSubscribe}
            >
              Subscribe
            </Button>
          </Box>

          <Typography variant="subtitle1" className="mb-1">
            Follow us
          </Typography>
          <Box>
            <IconButton><FaFacebook className="text-blue-700" /></IconButton>
            <IconButton><FaInstagram className="text-pink-600" /></IconButton>
            <IconButton><FaTwitter className="text-sky-400" /></IconButton>
            <IconButton><FaTiktok className="text-black" /></IconButton>
          </Box>
        </Box>
      </Box>

      <Box className="text-center mt-5 pt-3 border-t border-white/30 text-sm">
        <Typography>© 2025 MyShop. All rights reserved.</Typography>
      </Box>
    </motion.footer>
  );
}
