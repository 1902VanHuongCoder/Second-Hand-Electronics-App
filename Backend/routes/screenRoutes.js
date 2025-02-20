const express = require('express');
const router = express.Router();
const screenController = require('../controllers/screenController');

router.get('/', screenController.getAllScreens);
router.get('/:id', screenController.getScreenById);
router.post('/', screenController.createScreen);
router.put('/:id', screenController.updateScreen);
router.delete('/:id', screenController.deleteScreen);

module.exports = router; 