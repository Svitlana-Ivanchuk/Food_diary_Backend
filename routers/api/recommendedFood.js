const express = require('express');

const router = express.Router();

const ctrl = require('../../controllers/recommendedFood');

router.get('/', ctrl.getAllFood);
router.get('/:foodId', ctrl.getFoodById);

module.exports = router;
