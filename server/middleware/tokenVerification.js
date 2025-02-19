const jwt = require("jsonwebtoken")

function tokenVerification(req, res, next) {
    // pobranie tokenu z nagłówka:
    let token = req.headers["x-access-token"];

    if (!token) {
        res.status(403).send({ message: "No token provided!" });
    }
    
    // jeśli przesłano token - weryfikacja jego poprawności:
    jwt.verify(token, process.env.JWTPRIVATEKEY, (err, decodeduser) => { 
        if (err) {
            console.log("Unauthorized!")
            res.status(401).send({ message: "Unauthorized!" });
        }
        console.log("Token correct, user: " + decodeduser._id) 
        
        // Jeśli token jest poprawny, zapisz zdekodowane dane w obiekcie żądania dla późniejszego użycia
        req.user = decodeduser
        next() // Przekazanie kontroli do następnego middleware'u lub obsługującej trasę funkcji
    })
}

module.exports = tokenVerification
   