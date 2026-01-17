

const Contact = require("../models/contact.model");

class ContactService {
  // create new contact (first user message)
  async createMessage(data) {
    const contact = new Contact(data);
    await contact.save();
    return contact;
  }

  // admin: get all contacts
  async getAllMessages() {
    return await Contact.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
  }

  // get messages for logged user
  async getMessagesByUser(userId) {
    return await Contact.find({ user: userId }).sort({ createdAt: -1 });
  }

  // delete contact
  async deleteMessage(id) {
    return await Contact.findByIdAndDelete(id);
  }


  async updateMessageStatus(id, status) {
    return await Contact.findByIdAndUpdate(id, { status }, { new: true });
  }
  
  // add reply (user or admin)
  async addMessage(contactId, sender, text, status) {
    const contact = await Contact.findById(contactId);
    if (!contact) throw new Error("Contact not found");

    contact.messages.push({
      sender,
      text,
    });

    if (status) {
      contact.status = status;
    }

    await contact.save();
    return contact;
  }
}

module.exports = new ContactService();
