const router = require("express").Router();
const { Product, validateProduct } = require("../models/product");
const multer = require('multer');

// Konfiguracja storage w multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

// Funkcja fileFilter do walidacji typów plików
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPG, JPEG, and PNG files are allowed.'));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB limit
    }
}).single('image');

// Middleware to handle errors from multer
const uploadMiddleware = (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            if (err instanceof multer.MulterError) {
                // Błędy multer (np. przekroczony limit rozmiaru pliku)
                return res.status(400).send({ message: err.message });
            } else if (err) {
                // Błędy związane z walidacją typów plików
                return res.status(400).send({ message: err.message });
            }
        }
        next();
    });
};

// Tworzenie nowego produktu
router.post("/", uploadMiddleware, async (req, res) => {
    console.log(req.file);

    // Sprawdź, czy plik obrazu został przesłany przez formularz
    const isImageProvided = req.file !== undefined;

    // Jeśli plik obrazu nie został przesłany, zwróć błąd
    if (!isImageProvided) {
        return res.status(400).send({ message: "Image is required" });
    }

    // Waliduj dane produktu
    const { error } = validateProduct({ ...req.body, image: req.file });
    if (error) return res.status(400).send({ message: error.details[0].message });

    try {
        const product = new Product({
            ...req.body,
            image: req.file.path
        });
        await product.save();
        res.status(201).send({ message: "Product created successfully" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Pobieranie wszystkich produktów
/*router.get("/", async (req, res) => {
    try {
        const products = await Product.find().populate("category_id", "name");
        res.status(200).send({ data: products, message: "Available Products"});
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});*/

// Pobieranie wszystkich produktów z filtrowaniem
router.get("/", async (req, res) => {
    try {
        // Pobieranie parametrów zapytania
        const { filter } = req.query;
        console.log('Received filter parameters:', filter);

        // Tworzenie warunków filtrowania na podstawie przekazanych parametrów
        const filterConditions = {};

        if (filter) {
            // Jeśli istnieją parametry filtrów, sparsuj je
            const minPrice = parseFloat(filter.price_min);
            const maxPrice = parseFloat(filter.price_max);

            if (filter.categories) {
                filterConditions.category_id = { $in: filter.categories };
            }
            if (!isNaN(minPrice) && !isNaN(maxPrice)) {
                filterConditions.price = { $gte: minPrice, $lte: maxPrice };
            } else if (!isNaN(minPrice)) {
                filterConditions.price = { $gte: minPrice };
            } else if (!isNaN(maxPrice)) {
                filterConditions.price = { $lte: maxPrice };
            }

            console.log("FILTER", JSON.stringify(filterConditions));

            // Pobieranie produktów z uwzględnieniem filtrowania
            const products = await Product.find(filterConditions).populate("category_id", "name");
            res.status(200).send({ data: products, message: "Available Products" });
        } else {
            // Jeśli brak parametrów filtrów, pobierz wszystkie produkty
            const products = await Product.find().populate("category_id", "name");
            res.status(200).send({ data: products, message: "Available Products" });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});


// Pobieranie produktu według ID
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("category_id", "name");
        if (!product) return res.status(404).send({ message: "Product not found" });

        res.status(200).send({ data: product });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Aktualizacja produktu
router.put("/:id", uploadMiddleware, async (req, res) => {
    console.log(req.file);
    console.log(req.body);

    let imagePath;
    if (req.file == undefined) {
        imagePath = req.file;
    } else {
        imagePath = req.file.path;
    }
    // Waliduj dane produktu
    const { error } = validateProduct({ ...req.body, image: req.file }, true);
    if (error) return res.status(400).send({ message: error.details[0].message });

    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                ...req.body,
                image: imagePath
            },
            { new: true }
        );
        if (!product) return res.status(404).send({ message: "Product not found" });

        res.status(200).send({ message: "Product updated successfully" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Usuwanie produktu
router.delete("/:id", async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).send({ message: "Product not found" });

        res.status(200).send({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

module.exports = router;
