const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.get('/details/:id', productController.getProductDetails);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.get('/search/ketquatimkiem', productController.searchProducts);
router.get('/edit/:id', productController.getProductForEdit);
router.get('/products-by-brand/:brandId', productController.getProductsByBrand);
router.patch('/:id/update-video', productController.updateProductVideo);

module.exports = router; 