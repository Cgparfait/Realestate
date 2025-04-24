const express = require("express")
const router = express.Router()
const landingMiddlewares = require("../middlewares/landingMiddlewares")
const Service = require("../models/services")
const Contact = require("../models/contacts")
const nodemailer = require('nodemailer');
const Article = require("../models/article")

router.get('/', async (req, res) => {
    try {
        const services = await Service.find()
        const contact_info = await Contact.findOne()

        res.render("landing/pages/home", { services, contact_info })

    }
    catch (e) {
        res.send("Failed to Load requirements for " + req.path)
    }
})
router.get('/services', async (req, res) => {
    try {
        const services = await Service.find()
        const contact_info = await Contact.findOne()

        res.render("./landing/pages/services", { services, contact_info })
    }
    catch {
        res.send("Failed to Load requirements for " + req.path)
    }
})
router.post('/send-email', landingMiddlewares.verifyContactForm, (req, res) => {
    const { address, name, phone, email, message } = req.body

    sendEmail(
        process.env.EMAIL_FROM,
        process.env.EMAIL_TO, // deployment
        // process.env.EMAIL_FROM, // production
        "Lioness Homes, You got new contact information!",
        `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nAddress: ${address}\nMessage: ${message}`
    )
})




// 1. GET all published articles
router.get('/blog', async (req, res) => {
    try {
        const articles = await Article.find();
        const services = await Service.find()
        const contact_info = await Contact.findOne()

        res.render('./landing/pages/articles', { articles: articles, services, contact_info })
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. GET a article by slug
router.get('/blog/article/:id', async (req, res) => {
    const { id } = req.params
    try {
        const article = await Article.findOne({ _id: id });
        const services = await Service.find()
        const contact_info = await Contact.findOne()

        if (!article) return res.status(404).json({ message: 'Article not found' });

        return res.render('./landing/pages/single-article', { article, services, contact_info })
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});










function sendEmail(from, to, subject, text) {
    const mailOptions = { from: from, to: to, subject: subject, text: text };

    transporter = getMailTransporter("gmail", process.env.EMAIL_FROM, process.env.PASS)
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return console.error({ message: 'Failed to send email', error: error.message });
        }
        console.log('Email sent:', info.response);
        console.error({ message: 'Email sent successfully' });
    });
}


function getMailTransporter(service, user, password) {
    return nodemailer.createTransport({
        service: service, // Use Gmail as the email service
        auth: { user: user, pass: password },
        tls: { rejectUnauthorized: false },// Disable certificate verification
    });
}


module.exports = router