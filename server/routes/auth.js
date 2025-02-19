const router = require("express").Router()
const { User } = require("../models/user")
const bcrypt = require("bcrypt")
const Joi = require("joi")

// Trasa dla logowania
router.post("/", async (req, res) => {
    try {
        const { error } = validateLogin(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message })

        const user = await User.findOne({ email: req.body.email })
        if (!user)
            return res.status(401).send({ message: "Invalid Email or Password" })
    
        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        )
        if (!validPassword)
            return res.status(401).send({ message: "Invalid Email or Password" })
        
        const token = user.generateAuthToken();
        res.status(200).send({ data: token, message: "logged in successfully" })
        console.log('logged in successfully')
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

// Trasa do wyświetlania szczegółów konta użytkownika (wymagany token):
router.get("/user", async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password'); // Pobranie użytkownika bez hasła
        res.status(200).send({ data: user, message: "Your Account" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Trasa do usuwania konta użytkownika (wymagany token):
router.delete("/user", async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user._id); // Usunięcie użytkownika z bazy danych
        res.status(200).send({ message: "User account deleted successfully" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

const validateLogin = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password"),
    })
    return schema.validate(data)
}

module.exports = router