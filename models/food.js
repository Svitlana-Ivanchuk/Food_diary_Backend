const { Schema, model } = require('mongoose');

const { handleMongooseError } = require('../helpers');

const foodSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      require: true,
    },
    img: {
      type: String,
      require: true,
    },
    calories: {
      type: Number,
      require: true,
    },
    nutrition: {
      carbohydrates: {
        type: Number,
        require: true,
      },
      protein: {
        type: Number,
        require: true,
      },
      fat: {
        type: Number,
        require: true,
      },
    },
  },
  { versionKey: false, timestamps: true },
);

foodSchema.post('save', handleMongooseError);

const RecommendedFood = model('recommendedFood', foodSchema);

module.exports = { RecommendedFood };
