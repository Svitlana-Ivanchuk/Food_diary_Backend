const calculateCalories = (isMale, weight, height, age, activity) => {
  const bmr = isMale
    ? 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age
    : 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;

  return bmr * activity;
};

const calculateWater = (weight, activity) => {
  const baseWater = weight * 0.03;

  switch (activity) {
    case '1.2':
      return baseWater;
    case '1.375':
      return baseWater + 0.35;
    case '1.55':
      return baseWater + 0.35;
    case '1.725':
      return baseWater + 0.35;
    case '1.9':
      return baseWater + 0.7;
    default:
      return baseWater;
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

module.exports = {
  calculateMacro,
  calculateWater,
  calculateCalories,
};
