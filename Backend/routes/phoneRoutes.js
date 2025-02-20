const express = require('express');
const router = express.Router();
const phoneController = require('../controllers/phoneController');

router.get('/', phoneController.getAllPhones);
router.get('/:id', phoneController.getPhoneById);
router.post('/', phoneController.createPhone);
router.put('/:id', phoneController.updatePhone);
router.delete('/:id', phoneController.deletePhone);

module.exports = router; 