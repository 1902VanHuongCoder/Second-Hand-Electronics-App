const express = require('express');
const { register, login, update, updateUser, togglePhoneVisibility } = require('../controllers/userController');

const router = express.Router();

router.post('/signup', register);
router.post('/login', login);
router.put('/update', updateUser);
router.put('/toggle-phone-visibility', togglePhoneVisibility);
module.exports = router; 