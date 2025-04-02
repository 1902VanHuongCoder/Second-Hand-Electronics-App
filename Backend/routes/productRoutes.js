const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');


// Route để lấy danh sách sản phẩm
router.get('/', productController.getAllProducts);

// Route để lấy sản phẩm theo id
router.get('/:id', productController.getProductById);

// Route để lấy sản phẩm theo id
router.get('/details/:id', productController.getProductDetails);

// Route để thêm Product
router.post('/', productController.createProduct);

// Route để cập nhật Product
router.put('/:id', productController.updateProduct);

// Route để xóa Product
router.delete('/:id', productController.deleteProduct);

// Route để tìm kiếm Product
router.get('/search/ketquatimkiem', productController.searchProducts);

// Route để lấy danh sách sản phẩm theo Brand
router.get('/edit/:id', productController.getProductForEdit);

// Route để cập nhật Product
router.patch('/:id/update-video', productController.updateProductVideo);

// Route để cập nhật Product
router.patch('/hiddenPost/:id', productController.toggleHideProduct);


module.exports = router; 