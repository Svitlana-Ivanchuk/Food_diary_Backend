require('dotenv').config();
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const crypto = require('node:crypto');
const { ctrlWrapper, HttpError } = require('../helpers');
const { User } = require('../models/user');
const { SECRET_KEY, META_USER, META_PASSWORD } = process.env;


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
  const response = {
    user: {
      name: newUser.name,
      password: newUser.subscription,
      email: newUser.email,
      goal: newUser.goal,
      gender: newUser.gender,
      age: newUser.age,
      height: newUser.height,
      weight: newUser.weight,
      activity: newUser.activity,
    },
  };
  res.status(201).json(response);
};

const login = async (req, res) => {
  const { email, password } = req.body;

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
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '24h' });

  await User.findByIdAndUpdate(user._id, { token });

  res.json({ token, user: { name: user.name, email: user.email } });
};
const current = async (req, res) => {
  const {
    name,
    email,
    goal,
    gender,
    age,
    height,
    weight,
    activity,
    avatarURL,
  } = req.user;

  res.json({
    user: {
      name,
      email,
      goal,
      gender,
      age,
      height,
      weight,
      activity,
      avatarURL,
    },
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: '' });

  res.status(204).end();
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(404, `User with '${email}' is missing`);
  }
  const newPassword = crypto.randomUUID();
  const hashPasword = await bcrypt.hash(newPassword, 10);

  await User.findByIdAndUpdate(user._id, { password: hashPasword });

  const transporter = nodemailer.createTransport({
    host: 'smtp.meta.ua',
    port: 465,
    secure: true,
    auth: {
      user: META_USER,
      pass: META_PASSWORD,
    },
  });

  const templatePath = path.join(
    __dirname,
    '../',
    'helpers',
    'emailTemplate.html',
  );
  const template = fs.readFileSync(templatePath, 'utf8');

  const mailOptions = {
    from: META_USER,
    to: email,
    subject: 'Відновлення паролю Healthy Hub',
    html: template.replace('${newPassword}', newPassword),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      throw HttpError(500, 'Помилка при відправленні листа');
    }
    console.log('Email sent: ' + info.response);
    res.json({ message: 'Новий пароль відправлено на ваш email' });
  });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  current: ctrlWrapper(current),
  logout: ctrlWrapper(logout),
  forgotPassword: ctrlWrapper(forgotPassword),
};
