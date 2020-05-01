const express = require('express');

const { postEvent } = require('../controllers');

const router = express.Router();

router.route('/event').post(postEvent);

module.exports = router;
