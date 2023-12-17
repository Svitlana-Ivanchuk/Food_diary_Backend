const { ctrlWrapper, HttpError } = require('../helpers');
const moment = require('moment');
const { User } = require('../models/user');
const { Water } = require('../models/waterIntake');
const Food = require('../models/foodIntake');

const currentDate = moment().format('YYYY-MM-DD');

const calculateCalories = (isMale, weight, height, age, activity) => {
  const bmr = isMale
    ? 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age
    : 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;

  return bmr * activity;
};

const calculateWater = (weight, activityLevel) => {
  const baseWater = weight * 0.03;

  switch (activityLevel) {
    case '1.2':
      return baseWater;
    case '1,375':
      return baseWater + 0.35;
    case '1.55':
      return baseWater + 0.35;
    case '1.725':
      return baseWater + 0.35;
    case '1.9':
      return baseWater + 0.7;
  }
};

const calculateMacro = goal => {
  switch (goal) {
    case 'Lose Fat':
      return {
        protein: 0.25,
        fat: 0.2,
        carbs: 0.55,
      };
    case 'Gain Muscle':
      return {
        protein: 0.3,
        fat: 0.2,
        carbs: 0.5,
      };
    case 'Maintain':
      return {
        protein: 0.2,
        fat: 0.25,
        carbs: 0.55,
      };
  }
};

const getCurrent = async (req, res) => {
  const { email, name, gender, weight, height, age, activity, goal } = req.user;
  const isMale = gender === 'male';
  const calories = calculateCalories(isMale, weight, height, age, activity);
  const water = calculateWater(weight, activity);
  const macro = calculateMacro(goal);

  console.log(req);

  res.status(200).json({
    email,
    name,
    calories,
    gender,
    weight,
    height,
    age,
    activity,
    water,
    macro,
  });
};

const updateUser = async (req, res) => {
  const { weight, activity, goal, _id } = req.user;
  const water = calculateWater(weight, activity);
  const macro = calculateMacro(goal);

  try {
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.water = water;
    user.macro = macro;

    Object.assign(user, req.body);

    const updatedUser = await user.save();

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
  }
};

const addFood = async (req, res) => {
  const { _id: owner } = req.user;

  const result = await Food.create({ ...req.body, owner });
  res.status(201).json(result);
};

const updateFood = async (req, res) => {
  const { id } = req.params;
  const { breakfast, lunch, dinner, snack } = req.body;

  const result = await Food.findByIdAndUpdate(
    id,
    { $push: { breakfast, lunch, dinner, snack } },
    { new: true },
  );

  res.status(201).json(result);
};

const deleteFood = async (req, res) => {
  const { _id: owner } = req.user;
  const { _id } = req.body;

  const foodToDelete = await Food.findOne({ owner, date: currentDate });

  const result = await Food.findByIdAndUpdate(
    foodToDelete._id,
    {
      $pull: {
        breakfast: { _id: _id },
        lunch: { _id: _id },
        dinner: { _id: _id },
        snack: { _id: _id },
      },
    },
    { new: true },
  );

  if (!result) {
    return res.status(404).json({ message: 'Not found' });
  }

  res.status(200).json({ message: 'Successfully deleted' });
};

const addWater = async (req, res) => {
  const { _id: owner } = req.user;

  const result = await Water.create({ ...req.body, owner });
  res.status(201).json(result);
};

const deleteWater = async (req, res) => {
  const { _id: owner } = req.user;

  const waterToDelete = await Water.findOne({ owner, date: currentDate });
  console.log(waterToDelete);

  const result = await Water.findByIdAndDelete(waterToDelete._id);

  if (!result) {
    return res.status(404).json({ message: 'Not found' });
  }

  res.status(200).json({ message: 'Successfully deleted' });
};

module.exports = {
  getCurrent: ctrlWrapper(getCurrent),
  updateUser: ctrlWrapper(updateUser),
  addFood: ctrlWrapper(addFood),
  updateFood: ctrlWrapper(updateFood),
  deleteFood: ctrlWrapper(deleteFood),
  addWater: ctrlWrapper(addWater),
  deleteWater: ctrlWrapper(deleteWater),
};
