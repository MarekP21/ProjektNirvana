// najpierw wszystkie importy modułów
require('dotenv').config()

// utworzenie aplikacji express
const express = require('express')
const app = express()
const path = require('path');

const cors = require('cors')
const connection = require('./db')
const userRoutes = require("./routes/users")
const authRoutes = require("./routes/auth")
const commentRoutes = require("./routes/comments")
const productRoutes = require("./routes/products")
const categoryRoutes = require("./routes/categories") 
const cartRoutes = require("./routes/carts") 
const tokenVerification = require('./middleware/tokenVerification')


// zastosowanie formatu JSON do wymiany danych
app.use(express.json())

// nie blokowanie przez przeglądarkę wysyłania żądań
// do serwera z innych lokalizacji
app.use(cors({
    origin: '*'
}));
   
// trasy wymagające weryfikacji tokenem:
app.get("/api/comments", tokenVerification)
app.get("/api/comments/user", tokenVerification)
app.post("/api/comments", tokenVerification)
app.put("/api/comments/:id", tokenVerification)
app.delete("/api/comments/:id", tokenVerification)

app.get("/api/categories", tokenVerification)
app.get("/api/categories/:id", tokenVerification)
app.post("/api/categories", tokenVerification)
app.put("/api/categories/:id", tokenVerification)
app.delete("/api/categories/:id", tokenVerification)

app.get("/api/products", tokenVerification)
app.get("/api/products/:id", tokenVerification)
app.post("/api/products", tokenVerification)
app.put("/api/products/:id", tokenVerification)
app.delete("/api/products/:id", tokenVerification)

app.get("/api/carts", tokenVerification)
app.post("/api/carts/:productId", tokenVerification)
app.delete("/api/carts/:productId", tokenVerification)

app.get("/api/users/",tokenVerification)
app.get("/api/auth/user",tokenVerification)
app.delete("/api/auth/user",tokenVerification)

// POTEM trasy nie wymagające tokena (kolejność jest istotna!)
// import reguł routingu i dodanie funkcji 
// middleware (autentykacji) do wskazanych tras
app.use("/api/users", userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/comments", commentRoutes)
app.use("/api/products", productRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/carts", cartRoutes)

// Dodanie trasy do obsługi pobierania obrazów
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Połączenie z bazą danych
connection();

const port = process.env.PORT || 8080
app.listen(port, () => console.log(`Nasłuchiwanie na porcie ${port}`))