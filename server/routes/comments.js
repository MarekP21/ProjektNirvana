const router = require("express").Router();
const { Comment, validateComment } = require("../models/comment");

// Trasa do tworzenia nowego komentarza
router.post("/", async (req, res) => {
    const { error } = validateComment(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    try {
        const comment = new Comment({
            userId: req.user._id,
            ...req.body,
        });
        await comment.save();
        res.status(201).send({ message: "Comment created successfully" });
    } catch (error) {
        res.status(500).send({ message: "error.message" });
    }
});

// Trasa do pobierania wszystkich komentarzy
router.get("/", async (req, res) => {
    try {
        const comments = await Comment.find().populate("userId", "firstName lastName");
        res.status(200).send({ data: comments, message: "What does Nirvana mean to you?"});
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Trasa do pobierania komentarzy danego użytkownika
router.get("/user", async (req, res) => {
    try {
        const comments = await Comment.find({ userId: req.user._id });
        res.status(200).send({ data: comments });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Trasa do aktualizacji komentarza
router.put("/:id", async (req, res) => {
    const { error } = validateComment(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    try {
        const comment = await Comment.findByIdAndUpdate(
            req.params.id,
            { ...req.body },
            { new: true }
        );
        if (!comment) return res.status(404).send({ message: "Comment not found" });

        res.status(200).send({ message: "Comment updated successfully" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Trasa do usuwania komentarza
router.delete("/:id", async (req, res) => {
    try {
        const comment = await Comment.findByIdAndDelete(req.params.id);
        if (!comment) return res.status(404).send({ message: "Comment not found" });

        res.status(200).send({ message: "Comment deleted successfully" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

module.exports = router;
