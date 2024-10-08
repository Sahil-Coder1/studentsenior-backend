const pyqController = require('../controllers/pyqController');
const authorizeRole = require('../utils/rolePermission.js');
const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn, validatePyq } = require('../middleware.js');

router
    .route('/')
    .get(isLoggedIn, wrapAsync(pyqController.index))
    .post(
        isLoggedIn,
        authorizeRole('admin'),
        validatePyq,
        wrapAsync(pyqController.create)
    );

// Show form to add new PYQ
router.get('/new', isLoggedIn, wrapAsync(pyqController.new));

router
    .route('/:id')
    .get(isLoggedIn, wrapAsync(pyqController.show))
    .put(
        isLoggedIn,
        authorizeRole('admin'),
        validatePyq,
        wrapAsync(pyqController.editPyq)
    )
    .delete(
        isLoggedIn,
        authorizeRole('admin'),
        wrapAsync(pyqController.delete)
    );

// Edit - Show form to edit a PYQ
router.get(
    '/:id/edit',
    isLoggedIn,
    authorizeRole('admin'),
    wrapAsync(pyqController.edit)
);

module.exports = router;
