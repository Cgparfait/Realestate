const nodemailer = require('nodemailer');
const contactQueries = require("../services/contact")

const services = [
    {
        title: "Behind on Taxes",
        description: "Struggling with property tax debt? We help homeowners avoid tax liens or foreclosure by providing quick solutions, including cash offers for your home."
    },
    {
        title: "Probate Properties",
        description: "Inherited a property and not sure what to do next? We specialize in purchasing probate homes quickly and hassle-free, helping you move forward with ease."
    },
    {
        title: "Distressed Properties",
        description: "If your property needs major repairs or has been neglected, we offer cash deals so you can sell it as-is—no need for costly renovations."
    },
    {
        title: "Foreclosure Assistance",
        description: "Facing foreclosure? We can help stop the process by purchasing your home fast, giving you the financial relief you need."
    },
    {
        title: "Inherited Properties",
        description: "Unexpectedly received a home but don’t want the responsibility? We make selling easy, offering fair cash deals with a smooth transition."
    },
    {
        title: "Pre-Foreclosure Sales",
        description: "Act before foreclosure damages your credit. We buy homes quickly, helping you avoid legal trouble and financial stress."
    },
    {
        title: "Vacant or Abandoned Homes",
        description: "Owning a vacant property can be costly and attract unwanted issues. We purchase vacant homes fast, saving you time and money."
    },
    {
        title: "Code Violations",
        description: "Dealing with city fines or unpermitted work? We buy homes with code violations, so you don’t have to worry about fixing costly issues."
    },
    {
        title: "Divorce Sales",
        description: "Going through a divorce and need to sell your home fast? We provide a smooth and fair selling process to help you move on quickly."
    },
    {
        title: "Job Relocation or Downsizing",
        description: "Moving for work or looking to downsize? We help homeowners sell quickly without the stress of long market times."
    },
    {
        title: "Fire or Water-Damaged Homes",
        description: "If your home has suffered fire or water damage, selling can be tough. We buy properties as-is, offering a hassle-free solution."
    },
    {
        title: "Multi-Family & Rental Properties",
        description: "Tired of managing tenants or rental properties? We purchase multi-family units, whether they’re occupied or vacant, for a quick and easy sale."
    },
    {
        title: "Cash Offers for Homes",
        description: "Need to sell fast? We provide fair, all-cash offers with no realtor fees, no hidden costs, and a fast closing process."
    }
];
async function renderHomePage(req, res) {
    // contact_info = await contactQueries.get_contact_information()
    contact_info = {
        phone: 'asdfasd',
        email: 'asdfasd',
        address: "sdfasdfas",
    }
    res.render('./pages/home', { services, contact_info })
}

function renderServicesPage(req, res) {
    res.render("./pages/services", { services })
}

function sendMail(req, res) {
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
    console.log(req.body)

    const { address, name, phone, email, message } = req.body;

    // Validate request body
    if (!address || !name || !phone || !email || !message) {
        return res.status(400).json({ message: 'Missing required fields: address, name, phone, email, message' });
    }

    const mailOptions = {
        from: 'rparfait720@gmail.com',
        // to: "merhawitabdala@yahoo.com, 9377597753@mms.att.net, rukundoparfait5@gmail.com, 9378183427@mms.att.net, rparfait720@gmail.com", //deployment
        to: "9377597753@mms.att.net, rparfait720@gmail.com", // production
        subject: "Lioness Homes, You got new contact information!",
        text: `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nAddress: ${address}\nMessage: ${message}`
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ message: 'Failed to send email', error: error.message });
        }
        console.log('Email sent:', info.response);
        res.status(200).json({ message: 'Email sent successfully' });
    });
}
module.exports = { renderHomePage, renderServicesPage, sendMail }