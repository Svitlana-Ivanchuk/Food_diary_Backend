/** @format */
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { ctrlWrapper, HttpError } = require('../helpers');
const { User } = require('../models/user');
const { SEKRET_KEY } = process.env;

const register = async (req, res) => {
  const { email, password, name } = req.body;

  const user = await User.findOne({ email });

  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }

  if (user) {
    throw HttpError(409, 'Email already in use');
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

const login = async (req, res) => {
  const { email, password, name } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, 'Email or password invalid');
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, 'Email or password invalid');
  }

  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SEKRET_KEY, { expiresIn: '24h' });

  await User.findByIdAndUpdate(user._id, { token });

  res.json({ token, user: { email, name } });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
};
