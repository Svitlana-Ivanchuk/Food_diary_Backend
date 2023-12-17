const { ctrlWrapper, BPM } = require('../helpers');
const { User } = require('../models/user');

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

module.exports = {
  getCurrent: ctrlWrapper(getCurrent),
  updateUser: ctrlWrapper(updateUser),
};
