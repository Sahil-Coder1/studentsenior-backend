const express = require('express');
const {
    test,
    updateUser,
    deleteUser,
} = require('../../controllers/api/user.js');
const { verifyToken } = require('../../utils/verifyUser.js');

const router = express.Router();

router.get('/', test);
router.post('/update/:id', updateUser); // add verify token later (verifyToken)

// router.delete('/delete/:id', verifyToken, deleteUser);  //will implement later if needed

module.exports = router;
