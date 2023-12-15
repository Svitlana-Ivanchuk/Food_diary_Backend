const { HttpError, ctrlWrapper } = require('../helpers');
const { RecommendedFood } = require('../models/food');

const getAllFood = async (req, res) => {
  const foods = await RecommendedFood.find().exec();
  console.log(foods);
  res.status(200).json(foods);
};

async function getFoodById(req, res, next) {
  const { foodId } = req.params;

  const foodById = await RecommendedFood.findById(foodId).exec();
  if (!foodById) {
    throw HttpError(404, 'Not found');
  }
  res.status(200).json(foodById);
}

module.exports = {
  getAllFood: ctrlWrapper(getAllFood),
  getFoodById: ctrlWrapper(getFoodById),
};
