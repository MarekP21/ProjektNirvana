const mongoose = require("mongoose");
const Joi = require("joi");

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, maxlength: 50 },
    description: { type: String, required: true, maxlength: 500 },
    amount: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0.01, max: 99999999.99 },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    image: { type: String, required: true } 
});

const Product = mongoose.model("Product", productSchema);

const validateProduct = (data, isEditing = false) => {
    const schema = Joi.object({
        name: Joi.string().max(50).required().label("Name"),
        description: Joi.string().max(500).required().label("Description"),
        amount: Joi.number().integer().min(1).required().label("Amount"),
        price: Joi.number().min(0.01).max(99999999.99).required().label("Price"),
        category_id: Joi.string().optional().label("Category"),
        image: isEditing ? Joi.object({
            fieldname: Joi.string().required(),
            originalname: Joi.string().required(),
            encoding: Joi.string().required(),
            mimetype: Joi.string().valid('image/jpeg', 'image/png').required(),
            destination: Joi.string().required(),
            filename: Joi.string().required(),
            path: Joi.string().required(),
            size: Joi.number().required()
        }).label("Image") : Joi.object({
            fieldname: Joi.string().required(),
            originalname: Joi.string().required(),
            encoding: Joi.string().required(),
            mimetype: Joi.string().valid('image/jpeg', 'image/png').required(),
            destination: Joi.string().required(),
            filename: Joi.string().required(),
            path: Joi.string().required(),
            size: Joi.number().required()
        }).required().label("Image")
    });
    return schema.validate(data);
};

module.exports = { Product, validateProduct };


