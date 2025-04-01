const nodemailer = require('nodemailer');
const contactQueries = require("../services/contact")
const servicesQueries = require("../services/services")
require('dotenv').config()


// const services = [
//     {
//         title: "Behind on Taxes",
//         description: "Are you struggling with property tax debt? We help you avoid tax liens or foreclosure by providing quick solutions, including cash offers for your home."
//     },
//     {
//         title: "Probate Properties",
//         description: "You inherited a property and not sure what to do next? We specialize in purchasing probate homes quickly and hassle-free, helping you move forward with ease."
//     },
//     {
//         title: "Distressed Properties",
//         description: "If your property needs major repairs or has been neglected, we offer cash deals so you can sell it as-is—no need for costly renovations."
//     },
//     {
//         title: "Foreclosure Assistance",
//         description: "Are you facing foreclosure? We can help you stop the process by purchasing your home fast, giving you the financial relief you need."
//     },
//     {
//         title: "Inherited Properties",
//         description: "You unexpectedly received a home but don’t want the responsibility? We make selling easy, offering fair cash deals with a smooth transition."
//     },
//     {
//         title: "Pre-Foreclosure Sales",
//         description: "Did You want to act before foreclosure damages your credit? We buy homes quickly, helping you avoid legal trouble and financial stress."
//     },
//     {
//         title: "Vacant or Abandoned Homes",
//         description: "Owning a vacant property can be costly and attract unwanted issues. We purchase vacant homes fast, saving you time and money."
//     },
//     {
//         title: "Code Violations",
//         description: "Are you dealing with city fines or unpermitted work? We buy homes with code violations, so you don’t have to worry about fixing costly issues."
//     },
//     {
//         title: "Divorce Sales",
//         description: "Are you going through a divorce and need to sell your home fast? We provide a smooth and fair selling process to help you move on quickly."
//     },
//     {
//         title: "Job Relocation or Downsizing",
//         description: "Are you moving for work or looking to downsize? We help you sell quickly without the stress of long market times."
//     },
//     {
//         title: "Fire or Water-Damaged Homes",
//         description: "If your home has suffered fire or water damage, selling can be tough. We buy your property as-is, offering a hassle-free solution."
//     },
//     {
//         title: "Multi-Family & Rental Properties",
//         description: "Are you tired of managing tenants or rental properties? We purchase multi-family units, whether they’re occupied or vacant, for a quick and easy sale."
//     },
//     {
//         title: "Cash Offers for Homes",
//         description: "You need to sell fast? We provide fair, all-cash offers with no realtor fees, no hidden costs, and a fast closing process."
//     }
// ];

// services.forEach(service=>{
//     servicesQueries.createService(service.title, service.description)
// })

async function renderHomePage(req, res) {
    try {
        const services = await servicesQueries.getAllServices()
        const contact_info = await contactQueries.get_contact_information()

        res.render("./pages/home", { services, contact_info })
    }
    catch {
        res.send("Failed to Load requirements for " + req.path)
    }
}


const renderServicesPage = async (req, res) => {
    try {
        const services = await servicesQueries.getAllServices()
        const contact_info = await contactQueries.get_contact_information()
        
        res.render("./pages/services", { services, contact_info })
    }
    catch {
        res.send("Failed to Load requirements for " + req.path)
    }
}


function sendMail(req, res) {
    const { address, name, phone, email, message } = req.body

    sendEmail(
        process.env.EMAIL_FROM,
        // process.env.EMAIL_TO, // deployment
        process.env.EMAIL_FROM, // production
        "Lioness Homes, You got new contact information!",
        `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nAddress: ${address}\nMessage: ${message}`
    )
}

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


module.exports = { renderHomePage, renderServicesPage, sendMail }