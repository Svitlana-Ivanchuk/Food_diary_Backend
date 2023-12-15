const Food = require('../models/food');

const { HttpError, ctrlWrapper } = require('../helpers');

const getAllFood = async (req, res) => {
  const result = await Food.find().exec();
  console.log(result);
  res.status(200).send('food');
};

async function getFoodById(req, res, next) {
  const { foodId } = req.params;

  const foodById = await Food.findById(foodId).exec();
  if (!foodById) {
    throw HttpError(404, 'Not found');
  }
  res.status(200).json(foodById);
}

module.exports = {
  getAllFood: ctrlWrapper(getAllFood),
  getFoodById: ctrlWrapper(getFoodById),
};
