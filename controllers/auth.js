/** @format */
const bcrypt = require("bcryptjs");
const { User } = require("../models/user");

const register = async (req, res) => {
  const { email, password, name } = req.body;

  const user = await User.findOne({ email });

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  if (user) {
    throw new Error(409, "Email already in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
  });

  res.status(201).json({
    name: newUser.name,
    email: newUser.email,
  });
};

module.exports = { register };
