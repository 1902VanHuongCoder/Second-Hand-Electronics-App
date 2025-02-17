const express = require('express');
const { register, login, update, updateUser } = require('../controllers/userController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.put('/update', updateUser);
module.exports = router; 