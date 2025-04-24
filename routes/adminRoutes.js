const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const adminControllers = require('../controllers/adminControllers');
const authMiddleware = require('../middlewares/auth');
const Service = require('../models/services');
const Article = require('../models/article');
const Contact = require('../models/contacts');
const User = require('../models/user');

const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET,
    secure: true
})

// Configure Multer to use memory storage (no local saving)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB file size limit
    }
});

// ======================
// Authentication Routes
// ======================

// Login Page
router.get('/login', (req, res) => {
    res.render('./admin/pages/login', { error: false });
});

// Login Handler
router.post('/login', async (req, res) => {
    let { username, password } = req.body;
    username = username.toLowerCase().trim();

    const errors = {};
    if (!username) errors.username = 'Username is required';
    if (!password) errors.password = 'Password is required';

    if (Object.keys(errors).length) {
        return res.render('./admin/pages/login', { error: 'Username or password cannot be empty' });
    }

    try {
        const user = await User.findOne({ username, password });
        if (!user) {
            return res.render('./admin/pages/login', { error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 3600000 // 1 hour
        });
        res.redirect('/admin/');
    } catch (error) {
        console.error('Login error:', error);
        res.send('Failed to login, please contact the developer to fix issue');
    }
});

// Logout
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/admin/login');
});

// ======================
// Protected Routes (require auth)
// ======================
router.use(authMiddleware);

// Dashboard
router.get('/', async (req, res) => {
    try {
        const searchMetrics = await adminControllers.getOrganicSearchMetrics();
        res.render('./admin/pages/dashboard', {
            search_metrics: searchMetrics,
            activeNav: 'dashboard'
        });
    } catch (err) {
        console.error('Failed to fetch search metrics:', err);
        res.send('Failed to load requirements for the page, please contact the developer');
    }
});

// ======================
// Service Routes
// ======================

// Get all services (API)
router.get('/all-services', async (req, res) => {
    try {
        const services = await Service.find();
        if (!services) {
            return res.status(404).json({ error: 'Services not found' });
        }
        res.json({ services });
    } catch (error) {
        console.error('Service fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch services' });
    }
});

// Create Service Page
router.get('/service/create', (req, res) => {
    res.render('./admin/pages/create-service', { activeNav: 'create-service' });
});

// Create Service Handler
router.post('/service/create', async (req, res) => {
    const { title, description } = req.body;
    const errors = {};

    if (!title) errors.title = 'Title field is required';
    if (!description) errors.description = 'Description field is required';

    if (Object.keys(errors).length) {
        return res.status(400).json({ errors });
    }

    try {
        const newService = new Service({ title, description });
        const savedService = await newService.save();
        res.json(savedService);
    } catch (error) {
        console.error('Service creation error:', error);
        res.status(500).json({ error: 'Failed to create service' });
    }
});

// Edit Service Page
router.get('/service/edit', async (req, res) => {
    const services = await Service.find();
    res.render('./admin/pages/edit-service', {
        services,
        activeNav: 'edit-service'
    });
});

// Edit Service Handler
router.post('/service/edit', async (req, res) => {
    const { id, title, description } = req.body;

    if (!id) return res.status(400).json({ error: 'Service ID not provided' });
    if (!title && !description) {
        return res.status(400).json({ error: 'Please provide title or description' });
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;

    try {
        const updateResult = await Service.updateOne({ _id: id }, { $set: updateData });
        res.json(updateResult);
    } catch (error) {
        console.error('Service update error:', error);
        res.status(500).json({ error: 'Failed to update service' });
    }
});

// Delete Service Page
router.get('/service/delete', async (req, res) => {
    const services = await Service.find();
    res.render('./admin/pages/delete-service', {
        services,
        activeNav: 'delete-service'
    });
});

// Delete Service Handler
router.post('/service/delete', async (req, res) => {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'Service ID not provided' });

    try {
        const deleteResult = await Service.deleteOne({ _id: id });
        res.json(deleteResult);
    } catch (error) {
        console.error('Service deletion error:', error);
        res.status(500).json({ error: 'Failed to delete service' });
    }
});

// ======================
// Contact Routes
// ======================

// Edit Contact Page
router.get('/contact/edit', async (req, res) => {
    const contacts = await Contact.find();
    if (!contacts.length) {
        return res.status(404).json({ error: 'Contacts not found' });
    }

    const { email, phone, address, _id } = contacts[0];
    res.render('./admin/pages/edit-contact', {
        email,
        phone,
        address,
        id: _id,
        activeNav: 'edit-contact'
    });
});

// Edit Contact Handler
router.post('/contact/edit', async (req, res) => {
    const { id, email, phone, address } = req.body;

    if (!id) return res.status(400).json({ error: 'Contact ID not provided' });
    if (!email && !phone && !address) {
        return res.status(400).json({ error: 'Please provide phone, email, or address' });
    }

    const updateData = {};
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;

    try {
        const updateResult = await Contact.updateOne({ _id: id }, { $set: updateData });
        res.json(updateResult);
    } catch (error) {
        console.error('Contact update error:', error);
        res.status(500).json({ error: 'Failed to update contact' });
    }
});

// ======================
// Article Routes
// ======================

// Create Article Page
router.get('/article/create', async (req, res) => {
    const services = await Service.find();
    res.render('./admin/pages/create-article', {
        services,
        activeNav: 'create-article'
    });
});

// Save Article Handler (currently just echoes back the request)
router.post('/article/save-article', upload.single('thumbnail'), async (req, res) => {
    const { title, content, description } = req.body

    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        const uploadPromise = new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'lionesshomes',
                    resource_type: 'auto'
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );

            streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
        });

        const result = await uploadPromise;
        result.secure_url
        result.public_id
        result.format
        result.bytes

        const article = await Article.create({
            title: title,
            thumbnail: result.secure_url,
            description: description,
            content: content,
        });

        res.json({ success: true, article });


    } catch (error) {
        console.log(error)
        res.send(error)
    }
});

// Edit Article Page
router.get('/article/edit', async (req, res) => {
    const articles = await Article.find();
    res.render('./admin/pages/edit-article', {
        articles,
        activeNav: 'edit-article'
    });
});

// Edit Article Handler
router.post('/article/edit', async (req, res) => {
    const { id, title, description } = req.body;

    if (!id) return res.status(400).json({ error: 'Article ID not provided' });
    if (!title && !description) {
        return res.status(400).json({ error: 'Please provide title or description' });
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;

    try {
        const updateResult = await Article.updateOne({ _id: id }, { $set: updateData });
        res.json(updateResult);
    } catch (error) {
        console.error('Article update error:', error);
        res.status(500).json({ error: 'Failed to update article' });
    }
});

// Delete Article Page
router.get('/article/delete', async (req, res) => {
    const articles = await Article.find();
    res.render('./admin/pages/delete-article', {
        articles,
        activeNav: 'delete-article'
    });
});

// Delete Article Handler
router.post('/article/delete', async (req, res) => {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'Article ID not provided' });

    try {
        const deleteResult = await Article.deleteOne({ _id: id });
        res.json(deleteResult);
    } catch (error) {
        console.error('Article deletion error:', error);
        res.status(500).json({ error: 'Failed to delete article' });
    }
});


module.exports = router;