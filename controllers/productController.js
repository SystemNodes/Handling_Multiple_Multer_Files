const productModel = require('../models/productModel');
const fs = require('fs');

exports.addProduct = async (req, res) => {
    try{
        const {productName, description, price, quantity } = req.body;

        const productExists = await productModel.findOne({productName});
        if (productExists){
            return res.status(409).json({
                message: `${productName} already exist`
            });
        };
        
        const files = req.files;
        const imagePaths = files.map((el)=> el.path)
        const product = new productModel({
            productName,
            description,
            price,
            quantity,
            images: imagePaths
        });

        await product.save();

        res.status(201).json({
            message: "Product added successfully",
            data: product
        });

    }catch(err){
        res.status(500).json({
            error: err.message
        });
    }
};

exports.getAllProduct = async (req, res) => {
    try{
        const products = await productModel.find();

        res.status(200).json({
            message: `All products available totalled: ${products.length}`,
            data: products
        });

    }catch(err){
        res.status(500).json({
            error: err.message
        });
    }
};

exports.getOneProduct = async (req, res) => {
    try {
        const {id} = req.params;
        const product = await productModel.findById(id);

        if (!product){
            return res.status(404).json({
                message: "Product not found!"
            });
        };
        
        res.status(200).json({
            message: "Product found",
            data: product
        });

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const {productName, description, price, quantity } = req.body;
        const {id} = req.params;
        const files = req.files;
        const product = await productModel.findById(id);

        if (!product){
            return res.status(404).json({
                message: "Product not found!"
            });
        };
        
        const data = {
            productName: productName || product.productName, 
            description: description || product.description,
            price: price || product.price, 
            quantity: quantity || product.quantity,
            images: product.images
        };

        const imagePaths = files.map((e)=>e.path)

        const oldFilePaths = product.images
        if (files && files[0]){
            oldFilePaths.forEach((e)=>{
                const fileCheck = fs.existsSync(e)
                if (fileCheck){
                    fs.unlinkSync(e)
                }
            });

            data.images = imagePaths;
        }
        
        const updatedProduct = await productModel.findByIdAndUpdate(id, data, {new: true});

        res.status(200).json({
            message: "Product updated successfully",
            data: updatedProduct
        });
        
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const {id} = req.params;
        const product = await productModel.findById(id);

        if(!product) {
            return res.status(404).json({
                message: "Product not found!"
            });
        };

        const storagePaths = product.images
        if (storagePaths && storagePaths.length > 0) {
            storagePaths.forEach((e)=>{
                const fileCheck = fs.existsSync(e)
                if (fileCheck){
                    fs.unlinkSync(e)
                }
            });
        };

        await product.deleteOne();

        res.status(200).json({
            message: "Product deleted successfully"
        });
        
    } catch (err) {
        res.status(500).json({
            error: err.message
        }); 
    }
};

// Add a new image to the product images, while retaining the others.
exports.appendNewImages = async (req, res) => {
    try {
        const { productName, description, price, quantity } = req.body;
        const { id } = req.params;
        const files = req.files;

        const product = await productModel.findById(id);
        if (!product) {
            return res.status(404).json({ 
                message: "Product not found!" 
            });
        };

        const data = {
            productName: productName || product.productName,
            description: description || product.description,
            price: price || product.price,
            quantity: quantity || product.quantity,
            images: product.images
        };

        if (files && files.length > 0) {
            const newImagePaths = files.map((e) => e.path);
            data.images = [...product.images, ...newImagePaths];
        }

        const updatedProduct = await productModel.findByIdAndUpdate(id, data, { new: true });

        return res.status(200).json({
            message: "Product updated successfully",
            data: updatedProduct
        });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// Replace a particular image in the product images, while retaining the others.
exports.replaceProductImage = async (req, res) => {
    try {
        const { id, index } = req.params;
        const file = req.file;
  
        const product = await productModel.findById(id);
        if (!product) {
            return res.status(404).json({ 
                message: "Product not found!" 
            });
        }
  
        if (index < 0 || index >= product.images.length) {
            return res.status(400).json({ 
                message: "Invalid image index!" 
            });
        }
  
        if (fs.existsSync(product.images[index])) {
            fs.unlinkSync(product.images[index])
        }
  
        product.images[index] = file.path;
  
        await product.save();
  
        res.status(200).json({
            message: "Image replaced successfully",
            data: product
        });

    } catch (err) {
        res.status(500).json({ 
            error: err.message 
        });
    }
};

// Replace multiple images, while retaining the ones not specified
exports.replaceMultipleImages = async (req, res) => {
    try {
        const { id } = req.params;
        const { indexes } = req.body;
        const files = req.files;
  
        const product = await productModel.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found!" });
        }
  
        if (!indexes || indexes.length !== files.length) {
            return res.status(400).json({
                message: "Indexes count must match uploaded files count"
            });
        }
  
        indexes.forEach((value, index) => {
            if (value < 0 || value >= product.images.length) return;
    
            if (fs.existsSync(product.images[value])) {
                fs.unlinkSync(product.images[value]);
            }
    
            product.images[value] = files[index].path;
        });
  
        await product.save();
  
        res.status(200).json({
            message: "Selected images replaced successfully",
            data: product
        });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};

// Delete a single image from a product's collection of images.
exports.deleteProductImage = async (req, res) => {
    try {
        const { id, index } = req.params;
  
        const product = await productModel.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found!" });
        }
  
        if (index < 0 || index >= product.images.length) {
            return res.status(400).json({ 
                message: "Invalid image index!" 
            });
        }
  
        if (fs.existsSync(product.images[index])) {
            fs.unlinkSync(product.images[index]);
        }
  
        product.images.splice(index, 1);
  
        await product.save();
  
        res.status(200).json({
            message: "Image deleted successfully",
            data: product
        });
  
    } catch (err) {
        res.status(500).json({ 
            error: err.message 
        });
    }
};
