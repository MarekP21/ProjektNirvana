const router = require("express").Router()
const { User, validateSign } = require("../models/user")
const bcrypt = require("bcrypt") // do haszowania hasła

// Trasa dla rejestracji użytkownika
router.post("/", async (req, res) => {
    try {
        const { error } = validateSign(req.body)
        if (error)
            return res.status(400).send({ message: error.details[0].message })
    
        const user = await User.findOne({ email: req.body.email })
        if (user)
            return res
                .status(409)
                .send({ message: "User with given email already Exist!" })
    
        const salt = await bcrypt.genSalt(Number(process.env.SALT))
        const hashPassword = await bcrypt.hash(req.body.password, salt)
    
        // Hasła są odpowiednio haszowane
        const user2 = await new User({ ...req.body, password: hashPassword }).save()
        const token = user2.generateAuthToken();
        res.status(200).send({ data: token, message: "User created successfully" })
        console.log('User created successfully')
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

// Trasa do pobrania wszystkich użytkowników
router.get("/", async (req, res) => {
    //pobranie wszystkich użytkowników z bd:
    User.find().exec()
        .then(async () => {
            const users = await User.find().select('-password');
            
            //konfiguracja odpowiedzi res z przekazaniem listy użytkowników:
            res.status(200).send({ data: users, message: "Nirvana Fans" });
        })
        .catch(error => {
            res.status(500).send({ message: error.message });
        });
})

module.exports = router