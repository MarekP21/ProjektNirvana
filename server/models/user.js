const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const Joi = require("joi")

// do walidacji hasła przy rejestracji
const passwordComplexity = require("joi-password-complexity")

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
})

userSchema.methods.generateAuthToken = function () {
    // podpis domyślnie szyfrowany algorytmem HMAC SHA256
    // wygenerowanie tokena JWT
    const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
        expiresIn: "7d",
    })
    return token
}

const User = mongoose.model("User", userSchema)

const nameRegex = /^[A-ZŻŹĆĄŚĘŁÓŃ][a-zżźćńółęąś]*$/;

const validateSign = (data) => {
    const schema = Joi.object({
        firstName: Joi.string()
            .pattern(nameRegex)
            .required()
            .label("First Name")
            .messages({
                "string.pattern.base": '"First Name" must start with an uppercase letter followed by lowercase letters and cannot contain numbers.',
            }),
        lastName: Joi.string()
            .pattern(nameRegex)
            .required()
            .label("Last Name")
            .messages({
                "string.pattern.base": '"Last Name" must start with an uppercase letter followed by lowercase letters and cannot contain numbers.',
            }),
        email: Joi.string().email().required().label("Email"),
        password: passwordComplexity().required().label("Password"),
    });
    return schema.validate(data);
};
    
module.exports = { User, validateSign }

