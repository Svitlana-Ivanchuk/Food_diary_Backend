const express = require('express');

const ctrl = require('../../controllers/recommendedFood');

const router = express.Router();

router.get('/', ctrl.getAllFood);
router.get('/:foodId', ctrl.getFoodById);

module.exports = router;
