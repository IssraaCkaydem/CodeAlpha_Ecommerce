const bcrypt = require("bcryptjs");

async function generateHash() {
  const password = "admin123456789"; // الباسوورد يلي بدك ياه
  const hashed = await bcrypt.hash(password, 10);
  console.log("Hashed password: ", hashed);
}

generateHash();
