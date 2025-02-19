const router = require("express").Router();
const { Category, validateCategory } = require("../models/category");

// Tworzenie nowej kategorii
router.post("/", async (req, res) => {
    const { error } = validateCategory(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    try {
        const category = new Category(req.body);
        await category.save();
        res.status(201).send({ message: "Category created successfully" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Pobieranie wszystkich kategorii
router.get("/", async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).send({ data: categories });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Pobieranie kategorii według ID
router.get("/:id", async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).send({ message: "Category not found" });

        res.status(200).send({ data: category });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Aktualizacja kategorii
router.put("/:id", async (req, res) => {
    const { error } = validateCategory(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { ...req.body },
            { new: true }
        );
        if (!category) return res.status(404).send({ message: "Category not found" });

        res.status(200).send({ message: "Category updated successfully" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Usuwanie kategorii
router.delete("/:id", async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) return res.status(404).send({ message: "Category not found" });

        res.status(200).send({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

module.exports = router;
