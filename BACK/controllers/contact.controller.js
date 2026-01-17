


const contactService = require("../services/contact.service");

class ContactController {
  // ================= CREATE (USER FIRST MESSAGE) =================
  async sendMessage(req, res) {
    try {
      const { name, email, message } = req.body;
      if (!name || !email || !message) {
        return res
          .status(400)
          .json({ success: false, message: "All fields required" });
      }

      const data = {
        name,
        email,
        messages: [
          {
            sender: "user",
            text: message,
          },
        ],
      };

      if (req.user) data.user = req.user._id;

      const saved = await contactService.createMessage(data);

      // 🔴 real-time → admin
      if (global.io) {
        global.io.to("admin-room").emit("contactUpdated", saved);
      }

      res.status(201).json({
        success: true,
        message: "Message sent successfully",
        data: saved,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }

  // ================= ADMIN: GET ALL =================
  async getAllMessages(req, res) {
    try {
      const messages = await contactService.getAllMessages();
      res.json({ success: true, data: messages });
    } catch (err) {
      res.status(500).json({ success: false, message: "Server error" });
    }
  }

  // ================= USER: GET HIS MESSAGES =================
  async getUserMessages(req, res) {
    try {
      const messages = await contactService.getMessagesByUser(req.user._id);
      res.json({ success: true, data: messages });
    } catch (err) {
      res.status(500).json({ success: false, message: "Server error" });
    }
  }

  // ================= ADMIN REPLY =================
  async adminReply(req, res) {
    try {
      const { id } = req.params;
      const { text } = req.body;

      if (!text)
        return res
          .status(400)
          .json({ success: false, message: "Reply required" });

      const updated = await contactService.addMessage(
        id,
        "admin",
        text,
        "read"
      );

      // 🔴 real-time → user
      if (global.io && updated.user) {
        global.io
          .to(updated.user.toString())
          .emit("contactUpdated", updated);
          console.log("Sent contactUpdated to user:", updated.user);

      }

      res.json({ success: true, data: updated });
    } catch (err) {
      res.status(500).json({ success: false, message: "Server error" });
    }
  }

  // ================= USER REPLY =================
  async userReply(req, res) {
    try {
      const { id } = req.params;
      const { text } = req.body;

      if (!text)
        return res
          .status(400)
          .json({ success: false, message: "Reply required" });

      const updated = await contactService.addMessage(
        id,
        "user",
        text,
        "pending"
      );

      // 🔴 real-time → admin
      if (global.io) {
        global.io.to("admin-room").emit("contactUpdated", updated);
      }

      res.json({ success: true, data: updated });
    } catch (err) {
      res.status(500).json({ success: false, message: "Server error" });
    }
  }

  // ================= DELETE =================
  async deleteMessage(req, res) {
    try {
      const { id } = req.params;
      await contactService.deleteMessage(id);
      res.json({ success: true, message: "Deleted" });
    } catch (err) {
      res.status(500).json({ success: false, message: "Server error" });
    }
  }

 
  async updateMessageStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
  
      const updated = await contactService.updateMessageStatus(id, status);
  
      // 🔥 REAL-TIME TO USER
      if (global.io && updated.user) {
        global.io
          .to(updated.user.toString())
          .emit("contactUpdated", updated);
      }
  
      res.json({ success: true, data: updated });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
  
}

module.exports = new ContactController();

