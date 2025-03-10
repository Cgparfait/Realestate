const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const express = require('express');

const app = express();


// set view engine
app.set('view engine', 'ejs');
app.use(express.static('public'));


// body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Create a Nodemailer transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use Gmail as the email service
    auth: {
        user: 'rparfait720@gmail.com', // Your Gmail address
        pass: 'srlr luep jmsi cpcw'
    },
    tls: {
        rejectUnauthorized: false, // Disable certificate verification
    },
});



// Request handling
app.post('/send-email', (req, res) => {

    const { address, name, phone, email, message } = req.body;

    // Validate request body
    if (!address || !name || !phone || !email || !message) {
        return res.status(400).json({ message: 'Missing required fields: address, name, phone, email, message' });
    }

    const mailOptions = {
        from: 'AssetEdgeWebsite@gmail.com', // Sender address
        to: "rparfait720@gmail.com",
        subject: "New Contact information! From Asset Edge Realty",
        text: `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nAddress: ${address}\nMessage: ${message}`
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ message: 'Failed to send email', error: error.message });
        }
        console.log('Email sent:', info.response);
        res.status(200).json({ message: 'Email sent successfully', info });
    });
})

app.get('/', (req, res) => {
    res.render("index")
})



app.listen(3000, () => {
    console.log('Server is running on port 3000');
})