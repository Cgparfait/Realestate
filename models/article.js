const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Article title is required'],
        trim: true,
        maxlength: [120, 'Title cannot exceed 120 characters']
    },
    thumbnail: { type: String, required: true },
    slug: { type: String },
    description: { type: String },
    content: {
        type: mongoose.Schema.Types.Mixed, // Stores Editor.js JSON data
        required: true
    },
    metaTitle: String,
    metaDescription: String,
    updatedAt: {
        type: Date,
        default: Date.now
    },
}, {
    timestamps: true,
});


const Article = mongoose.model('Article', articleSchema);

module.exports = Article