
const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contact.controller");
const isAuthenticated = require("../middleware/auth");

// create contact
router.post("/", isAuthenticated, contactController.sendMessage);

// admin
router.get("/", isAuthenticated, contactController.getAllMessages);

// user
router.get("/user", isAuthenticated, contactController.getUserMessages);
router.patch("/:id", isAuthenticated, contactController.updateMessageStatus);

// replies
router.post("/:id/admin-reply", isAuthenticated, contactController.adminReply);
router.post("/:id/user-reply", isAuthenticated, contactController.userReply);

// delete
router.delete("/:id", isAuthenticated, contactController.deleteMessage);

module.exports = router;
