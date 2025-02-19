const mongoose = require("mongoose");
const Joi = require("joi");

const commentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    favoriteSong: { type: String, required: true },
    favoriteAlbum: { type: String, required: true },
    userComment: { type: String, required: true },
});

const Comment = mongoose.model("Comment", commentSchema);

const validateComment = (data) => {
    const schema = Joi.object({
        favoriteSong: Joi.string()
            .regex(/^[A-Z][a-zA-Z1-9\s]+$/)
            .required()
            .label("Favorite Song")
            .messages({
                "string.pattern.base": '"Favorite Song" must start with an uppercase letter and can only contain letters, numbers, and spaces.',
            }),
        favoriteAlbum: Joi.string()
            .regex(/^[A-Z][a-zA-Z1-9\s]+$/)
            .required()
            .label("Favorite Album")
            .messages({
                "string.pattern.base": '"Favorite Album" must start with an uppercase letter and can only contain letters, numbers, and spaces.',
            }),
        userComment: Joi.string()
            .min(10)
            .max(255)
            .required()
            .label("User Comment")
            .messages({
                "string.min": '"User Comment" must be at least 10 characters long.',
                "string.max": '"User Comment" must be less than or equal to 255 characters long.',
            }),
    });
    return schema.validate(data);
};

module.exports = { Comment, validateComment };
