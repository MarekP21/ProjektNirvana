const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const { Product, validateProduct } = require("../models/product")

router.get('/', async (req, res) => {
    try {
        const userId = req.user._id; // Zakładając, że masz middleware do uwierzytelniania użytkownika
        const cart = await Cart.findOne({ userId }).populate('items.productId');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        const items = cart.items.map(item => ({
            productId: item.productId._id,
            name: item.productId.name,
            quantity: item.quantity,
            price: item.productId.price,
            imagePath: item.productId.image,
        }));
        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        res.json({ items, total });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/:productId', async (req, res) => {
    try {
        const userId = req.user._id; // Zakładając, że masz middleware do uwierzytelniania użytkownika
        const {productId} = req.params;
        console.log(`Searching for product with ID: ${productId}`);
        
        let product;
        try {
            product = await Product.findById(productId);
        } catch (error) {
            console.error("Error occurred while finding product:", error);
            return res.status(500).json({ message: 'Error occurred while finding product' });
        }

        if (!product) {
            console.log(`Product with ID ${productId} not found`);
            return res.status(404).json({ message: 'Product not found' });
        }

        console.log(`Searching for cart for user with ID: ${userId}`);
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            console.log(`Cart not found for user with ID ${userId}`);
            cart = new Cart({ userId, items: [] });
        }

        const cartItem = cart.items.find(item => item.productId.toString() === productId);
        if (cartItem) {
            console.log(`Product with ID ${productId} already in cart. Current quantity: ${cartItem.quantity}`);
            cartItem.quantity += 1;
        } else {
            console.log(`Adding product with ID ${productId} to cart`);
            cart.items.push({ productId, name: product.name, quantity: 1, price: product.price, imagePath: product.image });
        }
        console.log(`Saving cart for user with ID ${userId}`);

        await cart.save();
        res.status(200).json({ message: 'Product added to cart' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/:productId', async (req, res) => {
    try {
        const userId = req.user._id; // Zakładając, że masz middleware do uwierzytelniania użytkownika
        const { productId } = req.params;

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const cartItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (cartItemIndex === -1) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        cart.items.splice(cartItemIndex, 1);
        await cart.save();
        res.status(200).json({ message: 'Product removed from cart' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;