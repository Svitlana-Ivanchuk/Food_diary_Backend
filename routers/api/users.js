const express = require('express');

const router = express.Router();

const ctrl = require('../../controllers/users');
const { authenticate, uploadCloud } = require('../../middlewares');

router.get('/current', authenticate, ctrl.getCurrent);

router.put(
  '/update',
  authenticate,
  uploadCloud.single('avatarURL'),
  ctrl.updateUser,
);

router.put('/goal', authenticate, ctrl.updateGoal);

router.post('/weight', authenticate, ctrl.updateWeight);

router.post('/food-intake', authenticate, ctrl.addFood);

router.put('/food-intake/:id', authenticate, ctrl.updateFood);

router.delete('/food-intake/', authenticate, ctrl.deleteFood);

router.post('/water-intake', authenticate, ctrl.addWater);

router.delete('/water-intake/', authenticate, ctrl.deleteWater);

module.exports = router;
