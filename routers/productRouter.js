const { 
    addProduct, 
    getAllProduct, 
    getOneProduct,
    updateProduct,
    deleteProduct,
    appendNewImages,
    replaceProductImage,
    replaceMultipleImages,
    deleteProductImage
} = require('../controllers/productController');

const router = require('express').Router();
const upload = require('../middleware/multer');

router.post('/product', upload.array('images', 4), addProduct);
router.get('/product', getAllProduct)
router.get('/product/:id', getOneProduct);
router.put('/product/:id', upload.array('images', 4), updateProduct);
router.delete('/product/:id', deleteProduct);
router.put('/product/:id/images', upload.array('images', 4), appendNewImages);
router.put('/product/:id/images/:index', upload.single('images'), replaceProductImage);
router.put('/product/:id/images/indexes', upload.array('images', 4), replaceMultipleImages);
router.delete('/product/:id/images/:index', deleteProductImage)

module.exports = router
