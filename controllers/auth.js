require('dotenv').config();
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const crypto = require('node:crypto');
const { ctrlWrapper, HttpError, BPM } = require('../helpers');
const { User, Weight } = require('../models');
const { SECRET_KEY, META_USER, META_PASSWORD } = process.env;
const currentDate = moment().format('YYYY-MM-DD');

const signup = async (req, res) => {
  const { email, password, name, goal, weight, height, age, activity, gender } =
    req.body;
  const recommendedMacro = BPM.calculateMacro(goal);
  const recommendedWater = Number(
    BPM.calculateWater(weight, activity).toFixed(5),
  );

  const isMale = gender.toLowerCase() === 'male';
  const recommendedCalories = Math.round(
    BPM.calculateCalories(isMale, weight, height, age, activity),
  );

  const recommendedFat = Math.round(recommendedMacro.fat * recommendedCalories);
  const recommendedCarbs = Math.round(
    recommendedMacro.carbs * recommendedCalories,
  );
  const recommendedProtein = Math.round(
    recommendedMacro.protein * recommendedCalories,
  );

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
    recommendedCarbs,
    recommendedProtein,
    recommendedFat,
    recommendedWater,
    recommendedCalories,
  });

  await Weight.create({
    weights: { [currentDate]: weight },
    owner: newUser._id,
  });
  const payload = {
    id: newUser._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '24h' });

  await User.findByIdAndUpdate(newUser._id, { token });

  const response = {
    token,
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

const signin = async (req, res) => {
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

  res.json({
    token,
    user: { name: user.name, email: user.email },
  });
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

const signout = async (req, res) => {
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
  const newPassword = crypto.randomBytes(6).toString('hex');
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
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  current: ctrlWrapper(current),
  signout: ctrlWrapper(signout),
  forgotPassword: ctrlWrapper(forgotPassword),
};
