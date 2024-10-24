const express = require('express');
const asyncHandler = require('express-async-handler');
const { getAllUsers, saveUser } = require('../controllers/userController');

const router = express.Router();

router.get('/',asyncHandler(getAllUsers));
router.post('/invite',asyncHandler(saveUser));

module.exports = router;