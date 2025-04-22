const express = require('express');
const router = express.Router();
const Article = require("../models/article")

// 1. GET all published articles
router.get('/', async (req, res) => {
    try {
        const articles = await Article.find();

        res.render('./article/base', { articles: articles })
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. GET a article by slug
router.get('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const article = await Article.findOne({ _id: id });
        if (!article) return res.status(404).json({ message: 'Article not found' });

        return res.render('./article/single', { article })
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. POST - Create a new article
router.post('/', async (req, res) => {
    try {
        const article = new Article(req.body);
        const savedArticle = await article.save();
        res.status(201).json(savedArticle);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 4. PUT - Update a article by ID
router.put('/:id', async (req, res) => {
    try {
        const updated = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: 'Article not found' });

        res.status(200).json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 5. DELETE a article
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Article.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Article not found' });

        res.status(200).json({ message: 'Article deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 6. PUT - Toggle publish status
router.put('/publish/:id', async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) return res.status(404).json({ message: 'Article not found' });

        article.isPublished = !article.isPublished;
        article.publishedAt = article.isPublished ? new Date() : null;

        const updated = await article.save();
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
