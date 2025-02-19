const mongoose = require("mongoose");
const Joi = require("joi");

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, maxlength: 100 }
});

const Category = mongoose.model("Category", categorySchema);

const validateCategory = (data) => {
    const schema = Joi.object({
        name: Joi.string().max(100).required().label("Name")
    });
    return schema.validate(data);
};

module.exports = { Category, validateCategory };
