const express = require('express');
const router = express.Router();
const Pyqs = require('../../models/PYQ.js');
const wrapAsync = require('../../utils/wrapAsync.js');

const apiPyqController = require('../../controllers/api/pyq.js');

// Fetch all colleges and send as JSON
router.get('/', apiPyqController.fetchPyq);

// Create a new college
router.post('/', wrapAsync(apiPyqController.createPyq));

module.exports = router;