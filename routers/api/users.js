const express = require('express');

const router = express.Router();

const ctrl = require('../../controllers/users');
const {
  authenticate,
  uploadCloud,
  validateBody,
} = require('../../middlewares');
const { userWeightSchema } = require('../../models/weight');
const { userWaterSchema } = require('../../models/waterIntake');

router.get('/current', authenticate, ctrl.getCurrent);

router.put(
  '/update',
  authenticate,
  uploadCloud.single('avatarURL'),
  ctrl.updateUser,
);

router.put('/goal', authenticate, ctrl.updateGoal);

router.post(
  '/weight',
  authenticate,
  validateBody(userWeightSchema),
  ctrl.updateWeight,
);

router.get('/food-intake', authenticate, ctrl.getFood);

router.post('/food-intake', authenticate, ctrl.addFood);

router.put('/food-intake/:id', authenticate, ctrl.updateFood);

router.delete('/food-intake/', authenticate, ctrl.deleteFood);

router.post(
  '/water-intake',
  authenticate,
  validateBody(userWaterSchema),
  ctrl.addWater,
);

router.delete('/water-intake/', authenticate, ctrl.deleteWater);

router.get('/statistics', authenticate, ctrl.statistics);

module.exports = router;
