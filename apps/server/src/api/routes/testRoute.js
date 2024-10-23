const express = require('express');
const asyncHandler = require('express-async-handler');
const { getTest } = require('../controllers/testController');

const router = express.Router();

router.get('/',  asyncHandler(getTest));

module.exports = router;