const {
  ctrlWrapper,
  calculateMacro,
  calculateWater,
  calculateCalories,
} = require('../helpers');
const moment = require('moment');

const { User } = require('../models/user');
const { Water } = require('../models/waterIntake');
const { Food } = require('../models/foodIntake');

const currentDate = moment().format('YYYY-MM-DD');

const getCurrent = async (req, res) => {
  const { email, name, gender, weight, height, age, activity, goal } = req.user;
  const isMale = gender === 'male';
  const calories = BPM.calculateCalories(isMale, weight, height, age, activity);
  const water = BPM.calculateWater(weight, activity);
  const macro = BPM.calculateMacro(goal);

  console.log(req);

  res.status(200).json({
    email,
    name,
    gender,
    weight,
    height,
    age,
    activity,
  });
};

const updateUser = async (req, res) => {
  const { weight, activity, goal, _id } = req.user;
  const water = BPM.calculateWater(weight, activity);
  const macro = BPM.calculateMacro(goal);

  try {
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.water = water;
    user.macro = macro;
    user.avatarURL = req.file.path;

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
