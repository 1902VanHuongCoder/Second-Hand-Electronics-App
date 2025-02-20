const express = require('express');
const router = express.Router();
const laptopController = require('../controllers/laptopController');

router.get('/', laptopController.getAllLaptops);
router.get('/:id', laptopController.getLaptopById);
router.post('/', laptopController.createLaptop);
router.put('/:id', laptopController.updateLaptop);
router.delete('/:id', laptopController.deleteLaptop);

module.exports = router;
