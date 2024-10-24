const router = require('express').Router();

/**
 * add here all the routes files, make sure you require the exact name since the default import is index.js
 * the base url is /api and then the path you define in the first argument 
 */

router.use('/test', require('./testRoute'));
router.use('/user', require('./userRoutes'));


module.exports = router;