const moment = require('moment');
const { ctrlWrapper, BPM, HttpError } = require('../helpers');

const { User, Water, Weight, Food } = require('../models/');

const currentDate = moment().format('YYYY-MM-DD');

const getCurrent = async (req, res) => {
  const {
    email,
    name,
    gender,
    weight,
    height,
    age,
    activity,
    goal,
    recommendedFat,
    recommendedProtein,
    recommendedCarbs,
    recommendedWater,
    recommendedCalories,
    avatarURL,
  } = req.user;

  if (!req.user) {
    throw HttpError(404, 'User not found');
  }

  res.status(200).json({
    email,
    name,
    gender,
    weight,
    height,
    age,
    activity,
    goal,
    recommendedFat,
    recommendedProtein,
    recommendedCarbs,
    recommendedWater,
    recommendedCalories,
    avatarURL,
  });
};

const updateUser = async (req, res) => {
  const { goal, _id: owner } = req.user;
  const { weight, activity, height, gender, age } = req.body;

  if (!weight || !activity || !height || !gender || !age) {
    throw HttpError(400, 'Invalid value');
  }

  const isMale = gender.toLowerCase() === 'male';
  const recommendedCalories = Math.round(
    BPM.calculateCalories(isMale, weight, height, age, activity),
  );

  const water = BPM.calculateWater(weight, activity);
  const macro = BPM.calculateMacro(goal);

  const user = await User.findById(owner);

  if (!user) {
    throw HttpError(404, 'User not found');
  }

  user.recommendedWater = water;
  user.recommendedCalories = recommendedCalories;
  user.recommendedFat = Math.round(macro.fat * recommendedCalories);
  user.recommendedProtein = Math.round(macro.protein * recommendedCalories);
  user.recommendedCarbs = Math.round(macro.carbs * recommendedCalories);
  // user.avatarURL = req.file.path;

  Object.assign(user, req.body);

  const updatedUser = await user.save();

  res.status(201).json(updatedUser);
};

const updateGoal = async (req, res) => {
  const { _id, recommendedCalories } = req.user;
  const { goal } = req.body;

  const macro = BPM.calculateMacro(goal);
  if (!macro) {
    throw HttpError(400, 'Invalid value');
  }

  const user = await User.findById(_id);

  if (!user) {
    throw HttpError(404, 'User not found');
  }

  user.recommendedFat = Math.round(macro.fat * recommendedCalories);
  user.recommendedProtein = Math.round(macro.protein * recommendedCalories);
  user.recommendedCarbs = Math.round(macro.carbs * recommendedCalories);

  Object.assign(user, req.body);
  const updatedUser = await user.save();

  res.status(201).json(updatedUser);
};

const updateWeight = async (req, res) => {
  const { _id: owner, gender, activity, height, age } = req.user;
  const { weight } = req.body;

  if (!weight) {
    throw HttpError(400, 'Invalid value');
  }

  if (!owner) {
    throw HttpError(404, 'User not found');
  }

  const isMale = gender.toLowerCase() === 'male';
  const recommendedCalories = Math.round(
    BPM.calculateCalories(isMale, weight, height, age, activity),
  );
  const water = BPM.calculateWater(weight, activity);

  await User.findByIdAndUpdate(owner, {
    recommendedCalories: recommendedCalories,
    recommendedWater: water,
    weight: weight,
  });

  const currentWeight = await Weight.findOne({ owner });

  if (currentWeight) {
    currentWeight.weights.set(currentDate, weight);
    const updatedWeight = await currentWeight.save();
    return res.status(200).json(updatedWeight);
  }

  const newWeight = await Weight.create({
    weights: { [currentDate]: weight },
    owner,
  });

  res.status(201).json(newWeight);
};

const addFood = async (req, res) => {
  const { _id: owner } = req.user;

  if (!owner) {
    throw HttpError(404, 'User not found');
  }

  const meals = ['breakfast', 'lunch', 'dinner', 'snack'];

  const totals = {
    totalCalories: 0,
    totalCarbs: 0,
    totalProtein: 0,
    totalFat: 0,
  };

  const result = await Food.create({
    owner,
    ...meals.reduce((acc, meal) => {
      const mealData = req.body[meal] || {};
      const totalFields = [
        'totalCalories',
        'totalCarbs',
        'totalProtein',
        'totalFat',
      ];

      const mealTotals = totalFields.reduce((mealAcc, field) => {
        mealAcc[field] = mealData[field] || 0;
        totals[field] += mealAcc[field];
        return mealAcc;
      }, {});

      acc[meal] = {
        dish: mealData.dish || [],
        ...mealTotals,
      };

      return acc;
    }, {}),
    ...totals,
  });

  if (!result) {
    throw HttpError(400, 'Invalid value');
  }

  res.status(201).json(result);
};

const updateFood = async (req, res) => {
  const { id } = req.params;
  const { breakfast, lunch, dinner, snack } = req.body;

  console.log(breakfast);

  const result = await Food.findByIdAndUpdate(
    id,
    {
      $push: {
        'breakfast.dish': { $each: breakfast },
        'lunch.dish': { $each: lunch },
        'dinner.dish': { $each: dinner },
        'snack.dish': { $each: snack },
      },
    },
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
  const { water } = req.body;

  if (!owner) {
    throw HttpError(404, 'User not found');
  }

  if (!water) {
    throw HttpError(400, 'Invalid value');
  }

  await Water.updateOne(
    { owner },
    {
      $inc: { [`waters.${currentDate}`]: water },
    },
    { new: true, upsert: true },
  );

  const value = await Water.findOne({ owner });

  res.status(201).json(value);
};

const deleteWater = async (req, res) => {
  const { _id: owner } = req.user;
  if (!owner) {
    throw HttpError(404, 'User not found');
  }

  const waterToDelete = await Water.findOne({
    owner,
    [`waters.${currentDate}`]: { $exists: true },
  });

  if (!waterToDelete) {
    throw HttpError(404, 'You have already removed all the water');
  }

  const result = await Water.findOneAndUpdate(
    { owner },
    { $unset: { [`waters.${currentDate}`]: 1 } },
    { new: true },
  );

  res.status(200).json(result);
};

module.exports = {
  getCurrent: ctrlWrapper(getCurrent),
  updateUser: ctrlWrapper(updateUser),
  addFood: ctrlWrapper(addFood),
  updateFood: ctrlWrapper(updateFood),
  deleteFood: ctrlWrapper(deleteFood),
  addWater: ctrlWrapper(addWater),
  deleteWater: ctrlWrapper(deleteWater),
  updateGoal: ctrlWrapper(updateGoal),
  updateWeight: ctrlWrapper(updateWeight),
};
